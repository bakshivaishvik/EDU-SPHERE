import hashlib
import json
import time
from datetime import datetime

class BlockchainSimulator:
    def __init__(self):
        self.chain = []
        self.create_genesis_block()

    def create_genesis_block(self):
        genesis_block = {
            'index': 0,
            'timestamp': str(datetime.now()),
            'data': "Genesis Block",
            'previous_hash': "0",
            'nonce': 0
        }
        self.chain.append(genesis_block)

    def create_block(self, video_data):
        previous_block = self.chain[-1]
        new_block = {
            'index': len(self.chain),
            'timestamp': str(datetime.now()),
            'data': video_data,
            'previous_hash': self.hash_block(previous_block),
            'nonce': 0
        }
        new_block['hash'] = self.hash_block(new_block)
        self.chain.append(new_block)
        return new_block

    @staticmethod
    def hash_block(block):
        block_string = json.dumps(block, sort_keys=True).encode()
        return hashlib.sha256(block_string).hexdigest()

    def validate_chain(self):
        for i in range(1, len(self.chain)):
            current = self.chain[i]
            previous = self.chain[i-1]
            
            if current['previous_hash'] != self.hash_block(previous):
                return False
            if current['hash'] != self.hash_block(current):
                return False
        return True

    def get_video_proof(self, video_id):
        for block in self.chain:
            if block['data'].get('video_id') == video_id:
                return {
                    'block_index': block['index'],
                    'timestamp': block['timestamp'],
                    'transaction_hash': block['hash']
                }
        return None