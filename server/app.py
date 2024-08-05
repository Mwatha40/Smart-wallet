from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

transactions = []
budgets = {}
categories = []

@app.route('/api/transactions', methods=['GET', 'POST'])
def transactions_route():
    if request.method == 'GET':
        return jsonify(transactions)
    elif request.method == 'POST':
        transaction = request.get_json()
        transaction['id'] = len(transactions) + 1
        transactions.append(transaction)
        return jsonify(transaction), 201

@app.route('/api/transactions/<int:id>', methods=['PUT', 'DELETE'])
def transaction_route(id):
    if request.method == 'PUT':
        transaction = request.get_json()
        transactions[id - 1] = transaction
        return jsonify(transaction)
    elif request.method == 'DELETE':
        del transactions[id - 1]
        return '', 204

@app.route('/api/budgets', methods=['GET', 'POST'])
def budgets_route():
    if request.method == 'GET':
        return jsonify(budgets)
    elif request.method == 'POST':
        budget = request.get_json()
        budgets[budget['category']] = budget['amount']
        return '', 201

@app.route('/api/budgets/<string:category>', methods=['PUT', 'DELETE'])
def budget_route(category):
    if request.method == 'PUT':
        budget = request.get_json()
        budgets[category] = budget['amount']
        return '', 204
    elif request.method == 'DELETE':
        del budgets[category]
        return '', 204

@app.route('/api/categories', methods=['GET', 'POST'])
def categories_route():
    if request.method == 'GET':
        return jsonify(categories)
    elif request.method == 'POST':
        category = request.get_json()
        category['id'] = len(categories) + 1
        categories.append(category)
        return jsonify(category), 201

@app.route('/api/categories/<int:id>', methods=['DELETE'])
def category_route(id):
    if request.method == 'DELETE':
        del categories[id - 1]
        return '', 204

if __name__ == '__main__':
    app.run(debug=True)
