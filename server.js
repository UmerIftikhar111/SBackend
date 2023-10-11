const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const CompaniesDB = require("./modules/companiesDB");
const db = new CompaniesDB();


// Load environment variables from a .env file
dotenv.config();

// Middleware: Enable CORS
app.use(cors());

// Middleware: Parse JSON requests
app.use(express.json());

// Define a simple GET route
app.get('/', (req, res) => {
  res.json({ message: 'API Listening' });
});

// Routes


// POST to add new company
app.post('/api/companies', async (req, res) => {
  try {
    const data = req.body;
    const result = await db.addNewCompany(data);
    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add a new company.' });
  }
});



// GET to view all companies
app.get('/api/companies', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10;
    const tag = req.query.tag;
    const companies = await db.getAllCompanies(page, perPage, tag);
    res.status(200).json(companies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch companies.' });
  }
});

// GET with parameter to view specific company
app.get('/api/company/:name', async (req, res) => {
  try {
    const name = req.params.name;
    const company = await db.getCompanyByName(name);
    if (!company) {
      res.status(404).json({ error: 'Company not found.' });
    } else {
      res.status(200).json(company);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch the company.' });
  }
});

// PUT to update company data
app.put('/api/company/:name', async (req, res) => {
  try {
    const name = req.params.name;
    const data = req.body;
    const result = await db.updateCompanyByName(data, name);
    if (result.nModified === 0) {
      res.status(404).json({ error: 'Company not found or data not modified.' });
    } else {
      res.status(200).json({ message: 'Company updated successfully.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update the company.' });
  }
});

// DELETE to remove company data
app.delete('/api/company/:name', async (req, res) => {
  try {
    const name = req.params.name;
    const result = await db.deleteCompanyByName(name);
    if (result.deletedCount === 0) {
      res.status(404).json({ error: 'Company not found.' });
    } else {
      res.status(204).json(); // No content, successful deletion
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete the company.' });
  }
});

// Start the server
const port = process.env.PORT || 3001;
db.initialize(process.env.MONGODB_CONN_STRING).then(()=>{
  app.listen(port, ()=>{
      console.log(`server listening on: ${port}`);
  });
}).catch((err)=>{
  console.log(err);
});
  
