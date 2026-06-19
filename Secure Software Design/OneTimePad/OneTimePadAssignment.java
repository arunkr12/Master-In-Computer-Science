import java.util.*;

public class OneTimePadAssignment {

    public static void main(String[] args) {

        String givenText = "MY NAME IS UNKNOWN";
        byte[] textBytes = givenText.getBytes();
        
        // 1. Generate Key of Same Length.
        byte[] key = new byte[textBytes.length];
        Random random = new Random(); 
        random.nextBytes(key);
        
        // 2. ENCRYPT (XOR operation)
        byte[] cipherBytes = new byte[textBytes.length];
        for (int i = 0; i < textBytes.length; i++) {
            cipherBytes[i] = (byte) (textBytes[i] ^ key[i]);
        }
        
        // 3. DECRYPT (XOR operation reversed)
        byte[] decryptedBytes = new byte[cipherBytes.length];
        for (int i = 0; i < cipherBytes.length; i++) {
            decryptedBytes[i] = (byte) (cipherBytes[i] ^ key[i]);
        }
        
        System.out.println("Original Text : " + givenText);
        System.out.println("Key (Base64)  : " + Base64.getEncoder().encodeToString(key));
        System.out.println("Ciphertext    : " + Base64.getEncoder().encodeToString(cipherBytes));
        System.out.println("Decrypted Text: " + new String(decryptedBytes));
    }
}