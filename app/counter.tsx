import { EVMWallet, useWallet, Wallet } from "@crossmint/client-sdk-react-native-ui";
import { EVMChain } from "@crossmint/wallets-sdk";
import React, { useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";


const counterContract = {
  address: '0xA63b3f815016c753cEbCe9FA2c8a390E78a1304c',
  abi: [
    {
      inputs: [],
      name: 'number',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'increment',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'uint256', name: 'newNumber', type: 'uint256' }],
      name: 'setNumber',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    }
  ],
};

export default function Counter() {
  const { wallet } = useWallet();
  const [txHash, setTxHash] = useState<string | null>(null);
  const [explorerLink, setExplorerLink] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const scrollViewRef = useRef<KeyboardAwareScrollView>(null);

  const transferTokens = useCallback(async () => {
    if (wallet == null) {
      return;
    }
    let evmWallet = new EVMWallet(wallet as Wallet<EVMChain>);

    try {
      setIsPending(true);
      const { hash, explorerLink } = await evmWallet.sendTransaction({
        to: counterContract.address,
        contractAbi: [{
          inputs: [],
          name: 'increment',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        }],
        functionName: 'increment',
        args: [],
      });
      if (hash) {
        setTxHash(hash);
        setExplorerLink(explorerLink);
      }
    } catch (error) {
      Alert.alert("Transfer Failed", `${error}`);
    } finally {
      setIsPending(false);
    }
  }, [wallet]);

  return (
    <KeyboardAwareScrollView
      ref={scrollViewRef}
      contentContainerStyle={styles.scrollContainer}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      extraScrollHeight={20}
    >
      {txHash && (
        <View style={styles.successMessage}>
          <Text style={styles.successText}>Transfer successful!</Text>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL(explorerLink || `https://sepolia.basescan.org/tx/${txHash}`)
            }
          >
            <Text style={styles.signatureText}>View on Basescan</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setTxHash(null)}>
            <Text style={styles.dismissText}>Dismiss</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.formSection}>
        <TouchableOpacity
          style={[
            styles.button,
            (isPending) &&
              styles.buttonDisabled,
          ]}
          onPress={transferTokens}
          disabled={isPending}
        >
          {isPending ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.buttonText}>Increment</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 24,
  },
  formSection: {
    width: "100%",
  },
  formLabel: {
    fontSize: 14,
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  tokenSelector: {
    flexDirection: "row",
    marginBottom: 16,
  },
  tokenOption: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 24,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#666",
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#05b959",
  },
  successMessage: {
    backgroundColor: "#e6ffe6",
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  successText: {
    color: "#008000",
    fontSize: 16,
    marginBottom: 8,
  },
  signatureText: {
    color: "#666",
    fontSize: 14,
    textDecorationLine: "underline",
    marginBottom: 8,
  },
  dismissText: {
    color: "#008000",
    fontSize: 14,
    textDecorationLine: "underline",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    backgroundColor: "#05b959",
    borderRadius: 8,
    width: "100%",
  },
  buttonSecondary: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E8E8E9",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#fff",
  },
  buttonTextSecondary: {
    color: "#000",
  },
});
