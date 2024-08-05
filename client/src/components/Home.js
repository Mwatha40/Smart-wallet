import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Home() {
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState({});
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Fetch initial data from the backend
    axios.get('/api/transactions')
      .then(response => setTransactions(response.data));

    axios.get('/api/budgets')
      .then(response => setBudgets(response.data));

    axios.get('/api/categories')
      .then(response => setCategories(response.data));
  }, []);

  const handleAddTransaction = (transaction) => {
    axios.post('/api/transactions', transaction)
      .then(response => {
        setTransactions([...transactions, response.data]);
      });
  };

  const handleUpdateTransaction = (transaction) => {
    axios.put(`/api/transactions/${transaction.id}`, transaction)
      .then(response => {
        setTransactions(transactions.map(t => t.id === transaction.id ? response.data : t));
      });
  };

  const handleDeleteTransaction = (id) => {
    axios.delete(`/api/transactions/${id}`)
      .then(() => {
        setTransactions(transactions.filter(t => t.id !== id));
      });
  };

  const handleAddBudget = (budget) => {
    axios.post('/api/budgets', budget)
      .then(response => {
        setBudgets({ ...budgets, [budget.category]: budget.amount });
      });
  };

  const handleUpdateBudget = (budget) => {
    axios.put(`/api/budgets/${budget.category}`, budget)
      .then(response => {
        setBudgets({ ...budgets, [budget.category]: budget.amount });
      });
  };

  const handleDeleteBudget = (category) => {
    axios.delete(`/api/budgets/${category}`)
      .then(() => {
        setBudgets(budgets => Object.keys(budgets).filter(key => key !== category).reduce((result, key) => ({ ...result, [key]: budgets[key] }), {}));
      });
  };

  const handleAddCategory = (category) => {
    axios.post('/api/categories', category)
      .then(response => {
        setCategories([...categories, response.data]);
      });
  };

  const handleDeleteCategory = (id) => {
    axios.delete(`/api/categories/${id}`)
      .then(() => {
        setCategories(categories.filter(c => c.id !== id));
      });
  };

  return (
    <div className="App">
      <h1>Wallet App</h1>
      {/* Transaction Section */}
      <TransactionList 
        transactions={transactions} 
        onDelete={handleDeleteTransaction} 
        onUpdate={handleUpdateTransaction} 
      />
      <AddTransaction onAdd={handleAddTransaction} />

      {/* Budget Section */}
      <BudgetList 
        budgets={budgets} 
        categories={categories} 
        onDelete={handleDeleteBudget} 
        onUpdate={handleUpdateBudget}
      />
      <AddBudget onAdd={handleAddBudget} categories={categories} />

      {/* Category Section */}
      <CategoryList 
        categories={categories} 
        onDelete={handleDeleteCategory} 
      />
      <AddCategory onAdd={handleAddCategory} />
    </div>
  );
}

function TransactionList({ transactions, onDelete, onUpdate }) {
  return (
    <div>
      <h2>Transactions</h2>
      <ul>
        {transactions.map(transaction => (
          <TransactionItem 
            key={transaction.id} 
            transaction={transaction} 
            onDelete={onDelete}
            onUpdate={onUpdate} 
          />
        ))}
      </ul>
    </div>
  );
}

function TransactionItem({ transaction, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTransaction, setEditedTransaction] = useState({ ...transaction });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    onUpdate(editedTransaction);
    setIsEditing(false);
  };

  const handleChange = (event) => {
    setEditedTransaction({ ...editedTransaction, [event.target.name]: event.target.value });
  };

  return (
    <li>
      {isEditing ? (
        <div>
          <input type="text" name="description" value={editedTransaction.description} onChange={handleChange} />
          <input type="number" name="amount" value={editedTransaction.amount} onChange={handleChange} />
          <button onClick={handleSave}>Save</button>
        </div>
      ) : (
        <div>
          <h3>{transaction.description}</h3>
          <p>${transaction.amount}</p>
          <button onClick={handleEdit}>Edit</button>
          <button onClick={() => onDelete(transaction.id)}>Delete</button>
        </div>
      )}
    </li>
  );
}

function AddTransaction({ onAdd }) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState(0);

  const handleSubmit = (event) => {
    event.preventDefault();
    onAdd({ description, amount });
    setDescription('');
    setAmount(0);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Transaction</h2>
      <input type="text" name="description" placeholder="Description" value={description} onChange={(event) => setDescription(event.target.value)} />
      <input type="number" name="amount" placeholder="Amount" value={amount} onChange={(event) => setAmount(event.target.value)} />
      <button type="submit">Add</button>
    </form>
  );
}

function BudgetList({ budgets, categories, onDelete, onUpdate }) {
  return (
    <div>
      <h2>Budgets</h2>
      <ul>
        {categories.map(category => (
          <BudgetItem 
            key={category.id} 
            category={category} 
            amount={budgets[category.name]} 
            onDelete={onDelete}
            onUpdate={onUpdate}
          />
        ))}
      </ul>
    </div>
  );
}

function BudgetItem({ category, amount, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedAmount, setEditedAmount] = useState(amount);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    onUpdate({ category: category.name, amount: editedAmount });
    setIsEditing(false);
  };

  const handleChange = (event) => {
    setEditedAmount(event.target.value);
  };

  return (
    <li>
      {isEditing ? (
        <div>
          <input type="number" name="amount" value={editedAmount} onChange={handleChange} />
          <button onClick={handleSave}>Save</button>
        </div>
      ) : (
        <div>
          <h3>{category.name}</h3>
          <p>${amount}</p>
          <button onClick={handleEdit}>Edit</button>
          <button onClick={() => onDelete(category.name)}>Delete</button>
        </div>
      )}
    </li>
  );
}

function AddBudget({ onAdd, categories }) {
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState(0);

  const handleSubmit = (event) => {
    event.preventDefault();
    onAdd({ category, amount });
    setCategory('');
    setAmount(0);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Budget</h2>
      <select value={category} onChange={(event) => setCategory(event.target.value)}>
        <option value="">Select Category</option>
        {categories.map(category => (
          <option key={category.id} value={category.name}>{category.name}</option>
        ))}
      </select>
      <input type="number" name="amount" placeholder="Amount" value={amount} onChange={(event) => setAmount(event.target.value)} />
      <button type="submit">Add</button>
    </form>
  );
}

function CategoryList({ categories, onDelete }) {
  return (
    <div>
      <h2>Categories</h2>
      <ul>
        {categories.map(category => (
          <CategoryItem key={category.id} category={category} onDelete={onDelete} />
        ))}
      </ul>
    </div>
  );
}

function CategoryItem({ category, onDelete }) {
  return (
    <li>
      <h3>{category.name}</h3>
      <button onClick={() => onDelete(category.id)}>Delete</button>
    </li>
  );
}

function AddCategory({ onAdd }) {
  const [name, setName] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    onAdd({ name });
    setName('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Category</h2>
      <input type="text" name="name" placeholder="Category Name" value={name} onChange={(event) => setName(event.target.value)} />
      <button type="submit">Add</button>
    </form>
  );
}

export default Home;