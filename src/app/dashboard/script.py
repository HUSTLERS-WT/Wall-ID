from flask import Flask, request, jsonify
from flask_cors import CORS
from web3 import Web3
from eth_account import Account

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/', methods=['POST'])
def send_transaction():
    data = request.get_json()
    private_key = data['usbStatus']
    recipient_address = data['recipientAddress']
    amount_eth = float(data['amountEth'])

    # Connect to Sepolia Testnet
    web3 = Web3(Web3.HTTPProvider("https://ethereum-sepolia.publicnode.com"))

    # Derive Sender's Address
    account = Account.from_key(private_key)
    sender_address = account.address

    # Check balance
    balance = web3.from_wei(web3.eth.get_balance(sender_address), "ether")
    if balance < amount_eth + 0.002:  # Ensure enough balance for transaction + gas
        return jsonify({"success": False, "error": "Insufficient balance!"})

    # Define Amount in Wei
    amount_wei = web3.to_wei(amount_eth, "ether")

    # Get Nonce
    nonce = web3.eth.get_transaction_count(sender_address)

    # Lower Gas Price to Reduce Cost
    gas_price = web3.to_wei(50, "gwei")  # Manually set a lower gas price
    gas_limit = 21000  # Standard gas limit for ETH transfers

    # Construct Transaction
    transaction = {
        'nonce': nonce,
        'to': recipient_address,
        'value': amount_wei,
        'gas': gas_limit,
        'gasPrice': gas_price,
        'chainId': 11155111  # Sepolia Testnet Chain ID
    }

    # Sign Transaction
    signed_tx = web3.eth.account.sign_transaction(transaction, private_key)

    # Broadcast Transaction
    tx_hash = web3.eth.send_raw_transaction(signed_tx.raw_transaction)

    return jsonify({"success": True, "txHash": web3.to_hex(tx_hash)})

if __name__ == '__main__':
    app.run(debug=True)
