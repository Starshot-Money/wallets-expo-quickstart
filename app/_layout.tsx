import React from "react";
import { Stack } from "expo-router";
import { StyleSheet, View } from "react-native";
import "../utils/polyfills";
import CrossmintProviders from "./providers";

import "../utils/polyfills";

export default function RootLayout() {
  return (
    <CrossmintProviders>
      <View style={styles.container}>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: {
              flex: 1,
            },
          }}
        >
          <Stack.Screen
            name="login"
            options={{
              contentStyle: {
                backgroundColor: "#FFFFFF",
              },
            }}
          />
          <Stack.Screen
            name="wallet"
            options={{
              contentStyle: {
                backgroundColor: "#F8FAFC",
              },
            }}
          />
        </Stack>
      </View>
    </CrossmintProviders>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
