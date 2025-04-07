import java.util.Scanner;
import java.lang.StringBuilder;

public class MessageDecoder {

    /**
     * Reverses the character rotation applied to the encoded hexadecimal string.
     * Assumes rotation was +20 on letters 'a'-'z' and +0 on digits '0'-'9'.
     * Reverse is -20 mod 26 = +6 for letters, and +0 for digits.
     *
     * @param encodedHex The input string (e.g., "636z6w...").
     * @return The hexadecimal string with rotation reversed (e.g., "636f6c...").
     */
    public static String reverseRotateHexString(String encodedHex) {
        StringBuilder correctedHex = new StringBuilder();
        int reverseShift = 6; // -20 is equivalent to +6 in a 26-letter alphabet (a-z)

        for (char c : encodedHex.toCharArray()) {
            if (c >= 'a' && c <= 'z') {
                // Reverse rotate lowercase letters
                int originalPos = c - 'a';
                // Add the reverse shift and wrap around using modulo 26
                int rotatedPos = (originalPos + reverseShift) % 26;
                correctedHex.append((char) ('a' + rotatedPos));
            } else if (c >= '0' && c <= '9') {
                // Digits were likely unchanged, so keep them as is
                correctedHex.append(c);
            } else {
                // Handle any other unexpected characters (e.g., uppercase, symbols)
                // Based on the example, these shouldn't occur if only 0-9/a-f were rotated into a-z range.
                // We'll keep them for now, but you might want error handling.
                // System.err.println("Warning: Unexpected character '" + c + "' found during reverse rotation.");
                correctedHex.append(c);
            }
        }
        return correctedHex.toString();
    }

    /**
     * Decodes a string of hexadecimal pairs into an ASCII/UTF-8 string.
     *
     * @param hex The hexadecimal string (must have an even number of characters).
     * @return The decoded string, or an error message if hex is invalid.
     */
    public static String decodeHexToString(String hex) {
        StringBuilder output = new StringBuilder();

        // Hex string must represent bytes, so it needs an even length.
        if (hex.length() % 2 != 0) {
            System.err.println("Error: Invalid hex string length (must be even).");
            return "[Error: Invalid Hex Length]";
        }

        try {
            for (int i = 0; i < hex.length(); i += 2) {
                // Get a pair of hex digits
                String hexPair = hex.substring(i, i + 2);
                // Convert the hex pair to an integer (byte value)
                int decimalValue = Integer.parseInt(hexPair, 16);
                // Convert the integer value to its character representation
                output.append((char) decimalValue);
            }
        } catch (NumberFormatException e) {
            System.err.println("Error: Invalid character found in hex string: " + hex);
            return "[Error: Invalid Hex Character]";
        } catch (Exception e) {
             System.err.println("An unexpected error occurred during hex decoding: " + e.getMessage());
            return "[Error: Decoding Failed]";
        }
        return output.toString();
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        System.out.println("Enter the encoded string to decode:");

        // Read the whole line of input
        String encodedInput = scanner.nextLine();

        if (encodedInput == null || encodedInput.trim().isEmpty()) {
            System.out.println("No input provided.");
        } else {
            System.out.println("\nDecoding steps:");
            // Step 1: Reverse the character rotation (+6 on letters a-z, +0 on digits 0-9)
            System.out.println("1. Applying reverse rotation to input string...");
            String correctedHexString = reverseRotateHexString(encodedInput);
            System.out.println("   Resulting (should-be) Hex: " + correctedHexString);

            // Step 2: Decode the corrected Hex String back to Text
            System.out.println("2. Decoding the hex string to text...");
            String decodedMessage = decodeHexToString(correctedHexString);

            System.out.println("\n--- Final Decoded Message ---");
            System.out.println(decodedMessage);
            System.out.println("-----------------------------");
        }

        // Close the scanner to prevent resource leaks
        scanner.close();
    }
}