// const express = require('express');
// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const cors = require('cors');
// const fs = require('fs');
// const csv = require('csv-parser');
// const xlsx = require('xlsx');

// const app = express();
// const PORT = 3000;
// const url = "mongodb+srv://5a3dNwMaZbLljVma:5a3dNwMaZbLljVma@cluster0.ts67j.mongodb.net/";

// mongoose.connect(url)
//   .then(() => console.log('Connected to MongoDB'))
//   .catch((error) => console.error('Error connecting to MongoDB:', error));

// app.use(cors());
// app.use(express.json());

// const userSchema = new mongoose.Schema({
//   username: { type: String, required: true },
//   email: { type: String, required: true },
//   password: { type: String, required: true },
// });

// const User = mongoose.model('User', userSchema);

// const productSchema = new mongoose.Schema({
//   product_name: { type: String, required: true },
//   description: { type: String, default: 'No description available' },
//   product_image: { type: String, default: 'default-image.png' },
//   product_category: { type: String, required: true, default: 'Miscellaneous' },
//   model_number: { type: String, default: 'N/A' },
//   serial_number: { type: String, default: 'N/A' },
//   stock_level: { type: Number, default: 0 },
//   reorder_point: { type: Number, default: 0 },
// });

// const Product = mongoose.model('Product', productSchema);

// const supplierSchema = new mongoose.Schema({
//   supplier_name: { type: String, required: true },
//   supplier_mail: { type: String, required: true },
//   contact_number: { type: String }
// });

// const Supplier = mongoose.model('Supplier', supplierSchema);

// const transactionSchema = new mongoose.Schema({
//   product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
//   supplier_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
//   order_date: { type: Date, required: true },
//   quantity: { type: Number, required: true, default: 0 },
//   order_status: { type: String, required: true, default: 'Pending' },
// });

// const Transaction = mongoose.model('Transaction', transactionSchema);

// const verifyToken = (req, res, next) => {
//   const token = req.headers['authorization'];
//   if (!token) {
//     return res.status(401).json({ error: 'Unauthorized' });
//   }

//   jwt.verify(token, 'secret', (err, decoded) => {
//     if (err) {
//       return res.status(401).json({ error: 'Unauthorized' });
//     }
//     req.user = decoded;
//     next();
//   });
// };

// app.post('/api/register', async (req, res) => {
//   try {
//     const existingUser = await User.findOne({ email: req.body.email });
//     if (existingUser) {
//       return res.status(400).json({ error: 'Email already exists' });
//     }

//     const hashedPassword = await bcrypt.hash(req.body.password, 10);
//     const newUser = new User({
//       username: req.body.username,
//       email: req.body.email,
//       password: hashedPassword,
//     });
    
//     await newUser.save();
//     res.status(201).json({ message: 'User registered successfully' });
//   } catch (error) {
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// app.post('/api/login', async (req, res) => {
//   try {
//     const user = await User.findOne({ email: req.body.email });
//     if (!user) {
//       return res.status(401).json({ error: 'Invalid credentials' });
//     }

//     const passwordMatch = await bcrypt.compare(req.body.password, user.password);
//     if (!passwordMatch) {
//       return res.status(401).json({ error: 'Invalid credentials' });
//     }

//     const token = jwt.sign({ email: user.email }, 'secret');
//     res.status(200).json({ token });
//   } catch (error) {
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// app.post('/api/products', verifyToken, async (req, res) => {
//   try {
//     const {
//       product_name, description, product_image, product_category, model_number,
//       serial_number, stock_level, reorder_point
//     } = req.body;

//     const newProduct = new Product({
//       product_name, description, product_image, product_category, model_number,
//       serial_number, stock_level, reorder_point
//     });

//     await newProduct.save();
//     res.status(201).json({ message: 'Product created successfully', product: newProduct });
//   } catch (error) {
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// app.post('/api/suppliers', verifyToken, async (req, res) => {
//   try {
//     const { supplier_name, supplier_mail, supplier_contact } = req.body;

//     const newSupplier = new Supplier({
//       supplier_name, supplier_mail, contact_number: supplier_contact
//     });

//     await newSupplier.save();
//     res.status(201).json({ message: 'Supplier created successfully', supplier: newSupplier });
//   } catch (error) {
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// app.post('/api/transactions', verifyToken, async (req, res) => {
//   try {
//     const { product_id, supplier_id, order_date, quantity, order_status } = req.body;

//     const newTransaction = new Transaction({
//       product_id, supplier_id, order_date, quantity, order_status
//     });

//     await newTransaction.save();
//     res.status(201).json({ message: 'Transaction created successfully', transaction: newTransaction });
//   } catch (error) {
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// app.get('/', (req, res) => {
//   res.send('Welcome to the Product, Supplier, and Transaction API!');
// });

// const parseDate = (dateString) => {
//   if (typeof dateString === 'string') {
//     const [month, day, year] = dateString.split('/').map((part) => parseInt(part, 10));

//     if (isNaN(month) || isNaN(day) || isNaN(year)) {
//       return new Date();
//     }

//     return new Date(year, month - 1, day);
//   } else if (dateString instanceof Date && !isNaN(dateString.getTime())) {
//     return dateString;
//   } else {
//     return new Date();
//   }
// };

// const importXlsxData = async () => {
//   const workbook = xlsx.readFile('Inventory_DataSet.xlsx');
//   const sheet = workbook.Sheets[workbook.SheetNames[0]];
//   const data = xlsx.utils.sheet_to_json(sheet);

//   for (const row of data) {
//     try {
//       const product_name = row['ProductName'] || 'Unknown Product';
//       const parts = product_name.split(' ');
//       const product_series = parts.slice(0, parts.length - 1).join(' ');
//       const model_number = parts[parts.length - 1];

//       const description = row['Description'] || 'No description available';
//       const product_image = row['Product Image'] || 'default-image.png';
//       const product_category = row['Product Cateogy Name'] || 'Miscellaneous';
//       const serial_number = row['Serial Number'] || 'N/A';
//       const stock_level = row['StockLevel'] ? Number(row['StockLevel']) : 0;
//       const reorder_point = row['ReorderPoint'] ? Number(row['ReorderPoint']) : 0;

//       const product = new Product({
//         product_name, description, product_image, product_category, model_number,
//         serial_number, stock_level, reorder_point
//       });
//       await product.save();

//       const supplier_name = row['Supplier Name'];
//       const supplier_mail = row['Supplier Mail'];
//       const supplier_contact = row['Supplier Contact'];

//       const supplier = new Supplier({
//         supplier_name, supplier_mail, contact_number: supplier_contact
//       });
//       await supplier.save();

//       let order_date = parseDate(row['Order Date']);

//       const quantity = row['Quantity'] ? Number(row['Quantity']) : 0;
//       const order_status = row['Order Status'] || 'Pending';

//       const transaction = new Transaction({
//         product_id: product._id,
//         supplier_id: supplier._id,
//         order_date,
//         quantity,
//         order_status
//       });
//       await transaction.save();

//     } catch (error) {
//       console.error('Error processing row:', error);
//     }
//   }

//   console.log('XLSX data successfully inserted');
// };

// importXlsxData();

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const fs = require('fs');
const csv = require('csv-parser');
const xlsx = require('xlsx');
const { parseISO, isValid } = require('date-fns');

const app = express();
const PORT = 3000;
const url = "mongodb+srv://5a3dNwMaZbLljVma:5a3dNwMaZbLljVma@cluster0.ts67j.mongodb.net/";

mongoose.connect(url)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Error connecting to MongoDB:', error));

app.use(cors());
app.use(express.json());

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

const productSchema = new mongoose.Schema({
  product_name: { type: String, required: true },
  description: { type: String, default: 'No description available' },
  product_image: { type: String, default: 'default-image.png' },
  product_category: { type: String, required: true, default: 'Miscellaneous' },
  model_number: { type: String, default: 'N/A' },
  serial_number: { type: String, default: 'N/A' },
  stock_level: { type: Number, default: 0 },
  reorder_point: { type: Number, default: 0 },
});

const Product = mongoose.model('Product', productSchema);

const supplierSchema = new mongoose.Schema({
  supplier_name: { type: String, required: true },
  supplier_mail: { type: String, required: true },
  contact_number: { type: String }
});

const Supplier = mongoose.model('Supplier', supplierSchema);

const transactionSchema = new mongoose.Schema({
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  supplier_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
  order_date: { type: Date, required: true },
  quantity: { type: Number, required: true, default: 0 },
  order_status: { type: String, required: true, default: 'Pending' },
});

const Transaction = mongoose.model('Transaction', transactionSchema);

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token, 'secret', (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    req.user = decoded;
    next();
  });
};

app.post('/api/register', async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });
    
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const passwordMatch = await bcrypt.compare(req.body.password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ email: user.email }, 'secret');
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/products', verifyToken, async (req, res) => {
  try {
    const {
      product_name, description, product_image, product_category, model_number, 
      serial_number, stock_level, reorder_point
    } = req.body;

    const newProduct = new Product({
      product_name, description, product_image, product_category, model_number,
      serial_number, stock_level, reorder_point
    });

    await newProduct.save();
    res.status(201).json({ message: 'Product created successfully', product: newProduct });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/suppliers', verifyToken, async (req, res) => {
  try {
    const { supplier_name, supplier_mail, supplier_contact } = req.body;

    const newSupplier = new Supplier({
      supplier_name, supplier_mail, contact_number: supplier_contact
    });

    await newSupplier.save();
    res.status(201).json({ message: 'Supplier created successfully', supplier: newSupplier });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/transactions', verifyToken, async (req, res) => {
  try {
    const { product_id, supplier_id, order_date, quantity, order_status } = req.body;

    const newTransaction = new Transaction({
      product_id, supplier_id, order_date, quantity, order_status
    });

    await newTransaction.save();
    res.status(201).json({ message: 'Transaction created successfully', transaction: newTransaction });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/', (req, res) => {
  res.send('Welcome to the Product, Supplier, and Transaction API!');
});

const parseDate = (dateString) => {
  if (typeof dateString === 'string') {
    const parsedDate = parseISO(dateString);
    return isValid(parsedDate) ? parsedDate : new Date();
  } else if (dateString instanceof Date && !isNaN(dateString.getTime())) {
    return dateString;
  } else {
    return new Date();
  }
};

const importXlsxData = async () => {
  const workbook = xlsx.readFile('Inventory_DataSet.xlsx');
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = xlsx.utils.sheet_to_json(sheet);

  for (const row of data) {
    try {
      const product_name = row['ProductName'] || 'Unknown Product';
      const parts = product_name.split(' ');  
      const product_series = parts.slice(0, parts.length - 1).join(' ');  
      const model_number = parts[parts.length - 1];  

      const description = row['Description'] || 'No description available';
      const product_image = row['Product Image'] || 'default-image.png';
      const product_category = row['Product Cateogy Name'] || 'Miscellaneous';
      const serial_number = row['Serial Number'] || 'N/A';
      const stock_level = row['StockLevel'] ? Number(row['StockLevel']) : 0;
      const reorder_point = row['ReorderPoint'] ? Number(row['ReorderPoint']) : 0;

      const product = new Product({
        product_name, description, product_image, product_category, model_number,
        serial_number, stock_level, reorder_point
      });
      await product.save();

      const supplier_name = row['Supplier Name'];
      const supplier_mail = row['Supplier Mail'];
      const supplier_contact = row['Supplier Contact'];

      const supplier = new Supplier({
        supplier_name, supplier_mail, contact_number: supplier_contact
      });
      await supplier.save();

      let order_date = parseDate(row['Order Date']); 

      const quantity = row['Quantity'] ? Number(row['Quantity']) : 0;
      const order_status = row['Order Status'] || 'Pending';

      const transaction = new Transaction({
        product_id: product._id, 
        supplier_id: supplier._id,
        order_date,
        quantity,
        order_status
      });
      await transaction.save();

    } catch (error) {
      console.error('Error processing row:', error);
    }
  }

  console.log('XLSX data successfully inserted');
};

importXlsxData();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
