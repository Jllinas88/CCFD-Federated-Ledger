const grpc = require('@grpc/grpc-js');
const crypto = require('crypto');
const { connect, signers, hash } = require('@hyperledger/fabric-gateway');
const fs = require('fs/promises');
const path = require('path');

const mspId = 'Org1MSP';
const cryptoPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com');
const keyDirectoryPath = path.resolve(cryptoPath, 'users', 'User1@org1.example.com', 'msp', 'keystore');
const certPath = path.resolve(cryptoPath, 'users', 'User1@org1.example.com', 'msp', 'signcerts', 'User1@org1.example.com-cert.pem');
const tlsCertPath = path.resolve(cryptoPath, 'peers', 'peer0.org1.example.com', 'tls', 'ca.crt');
const peerEndpoint = 'localhost:7051';
const peerHostAlias = 'peer0.org1.example.com';

async function main() {
    const client = await newGrpcConnection();
    const gateway = connect({
        client,
        identity: await newIdentity(),
        signer: await newSigner(),
        hash: hash.sha256,
    });

    try {
        const network = gateway.getNetwork('mychannel');
        const contract = network.getContract('basic');

        console.log('\n--> Submit Transaction: Storing Bank  Model Update');
  
const args = process.argv.slice(2);
const assetID = args[0] || 'update_default';
const bankName = args[1] || 'Unknown_Bank';
const modelHash = args[2] || 'no_hash';

const metricsPayload = JSON.stringify({
    bank: bankName,
    hash: modelHash,
    status: "Verified"
});

console.log(`--> Submitting: ${assetID} for ${bankName}`);

await contract.submitTransaction(
    'CreateAsset',
    assetID,          
    bankName,         
    '1',             
    metricsPayload, 
    '100'             
);
        console.log('*** Result: committed. Model update permanently recorded.');
        
    } finally {
        gateway.close();
        client.close();
    }
}

async function newGrpcConnection() {
    const tlsRootCert = await fs.readFile(tlsCertPath);
    const tlsCredentials = grpc.credentials.createSsl(tlsRootCert);
    return new grpc.Client(peerEndpoint, tlsCredentials, {
        'grpc.ssl_target_name_override': peerHostAlias,
    });
}

async function newIdentity() {
    const credentials = await fs.readFile(certPath);
    return { mspId, credentials };
}

async function newSigner() {
    const files = await fs.readdir(keyDirectoryPath);
    const keyPath = path.resolve(keyDirectoryPath, files[0]);
    const privateKeyPem = await fs.readFile(keyPath);
    const privateKey = crypto.createPrivateKey(privateKeyPem);
    return signers.newPrivateKeySigner(privateKey);
}

main().catch(console.error);

