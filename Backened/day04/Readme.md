# understanding the Cryptographic technique
1. lets there are three person p-1 p-h p-2 
p-h is the hacker who tries to read, manipulate the information that p-1 and p-2 sends to each other 

2. solution-1 use the symetric key but the problem is sharing it over network which is not secure and second is p-1 has to maintain all the keys of the other persons to who its talking 

3. asymetric keys : private and public key
1. public key is available freely to all, private key is never send over the network and its only own to th owner
3. data encrypted via private key can be decrypted by the its public key and vice versa as they are mathematically related 


//so when p-1 sends the data to p-2, p-1 uses the  p-2's public key and sends the data to p-2 
because of this this data can only be readed by p-2's
private key 

but what if p-h alters this data and encrypts its own fake data using p-2's public key and sends to p-2 then 
p-2 has no proof of the sender

// so we have to ensure about the sender 
// so when p-1 wants to send the data to p-2
// it first decrypts the data using its private key
// now everyone can read the message using p-1' public key so its confirmed that the message comes from p-1
now we have to ensure that only p-2 able to read the message

// so p-1 uses double encryption here
1. it encrpts the message using its private key
2. again encrypts the message using p-2's public key

now over the network no one can decypt the data , and its only be decrypted using p-2's private key first and then p-1's public key 


and using this we make sure
1. about sender
2. data not altered
3. and secured  

