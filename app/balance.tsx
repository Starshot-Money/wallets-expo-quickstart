import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
  RefreshControl,
} from "react-native";
import {
  useWallet,
  type Balances,
} from "@crossmint/client-sdk-react-native-ui";
import { Linking } from "react-native";

const formatBalance = (amount: string) => {
  return Number.parseFloat(amount).toFixed(2);
};

let balancesCache: Balances | null = null;

export default function Balance() {
  const { wallet } = useWallet();
  const [balances, setBalances] = useState<Balances | null>(balancesCache);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBalances = useCallback(async () => {
    if (wallet == null) {
      return;
    }
    try {
      const balances = await wallet.balances();
      setBalances(balances);
      balancesCache = balances;
    } catch (error) {
      Alert.alert("Error fetching wallet balances", `${error}`);
    }
  }, [wallet]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchBalances();
    setRefreshing(false);
  }, [fetchBalances]);

  useEffect(() => {
    fetchBalances();
  }, [fetchBalances]);

  if (wallet == null) {
    return (
      <View style={styles.container}>
        <Text>Loading wallet information...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="#05b959"
        />
      }
    >
      <View style={styles.balanceHeader}>
        <Text style={styles.sectionTitle}>Wallet balance</Text>
        <Text style={styles.sectionSubtitle}>Check the wallet balance</Text>
      </View>
      <View>
        <View style={styles.tokenContainer}>
          <View style={styles.tokenInfo}>
            <View style={styles.iconContainer}>
              <Image
                source={require("../assets/images/sol.png")}
                style={styles.tokenIcon}
              />
            </View>
            <Text style={styles.tokenSymbol}>SOL</Text>
          </View>
          <Text style={styles.tokenBalance}>
            {formatBalance(balances?.nativeToken.amount || "0")}{" "}
            {balances?.nativeToken.symbol}
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.tokenContainer}>
          <View style={styles.tokenInfo}>
            <View style={styles.iconContainer}>
              <Image
                source={require("../assets/images/usdc.png")}
                style={styles.tokenIcon}
              />
            </View>
            <Text style={styles.tokenSymbol}>USDC</Text>
          </View>
          <Text style={styles.tokenBalance}>
            ${formatBalance(balances?.usdc.amount || "0")}
          </Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.buttonSecondary]}
          onPress={() => Linking.openURL("https://faucet.solana.com")}
        >
          <View style={styles.buttonIconContainer}>
            <Image
              source={require("../assets/images/sol.png")}
              style={styles.buttonIcon}
            />
          </View>
          <Text style={[styles.buttonText, styles.buttonTextSecondary]}>
            Get test SOL
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.buttonSecondary]}
          onPress={() => Linking.openURL("https://faucet.circle.com")}
        >
          <View style={styles.buttonIconContainer}>
            <Image
              source={require("../assets/images/usdc.png")}
              style={styles.buttonIcon}
            />
          </View>
          <Text style={[styles.buttonText, styles.buttonTextSecondary]}>
            Get test USDC
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  balanceHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  divider: {
    height: 1,
    backgroundColor: "#EEEEEF",
    marginVertical: 8,
  },
  buttonContainer: {
    gap: 12,
    marginTop: 16,
  },
  tokenContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  tokenInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  tokenSymbol: {
    fontSize: 16,
    color: "#000",
  },
  tokenBalance: {
    fontSize: 16,
    color: "#000",
  },
  tokenIcon: {
    width: 28,
    height: 28,
    resizeMode: "contain",
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
  buttonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#fff",
  },
  buttonTextSecondary: {
    color: "#000",
  },
  buttonIconContainer: {
    marginRight: 8,
  },
  buttonIcon: {
    width: 20,
    height: 20,
    resizeMode: "contain",
  },
});
