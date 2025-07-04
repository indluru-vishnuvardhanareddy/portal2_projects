const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Debug middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    console.log('Body:', req.body);
    next();
});

// SAP Configuration
const SAP_CONFIG = {
    baseURL: 'http://AZKTLDS5CP.kcloud.com:8000',
    username: process.env.SAP_USERNAME,
    password: process.env.SAP_PASSWORD,
    odataService: '/sap/opu/odata/SAP/ZVVR_LOGIN_SRV'
};

// Test route
app.get('/test', (req, res) => {
    res.json({ message: 'Server is working' });
});

// Login endpoint
app.post('/api/login', async (req, res) => {
    try {
        const { vendorId, password } = req.body;
        console.log('Login attempt received for vendor:', vendorId);

        if (!vendorId || !password) {
            return res.status(400).json({
                success: false,
                message: 'Vendor ID and Password are required'
            });
        }

        const response = await axios({
            method: 'get',
            url: `${SAP_CONFIG.baseURL}${SAP_CONFIG.odataService}/zvvr_loginSet(VendorId='${vendorId}',Password='${password}')`,
            auth: {
                username: SAP_CONFIG.username,
                password: SAP_CONFIG.password
            },
            headers: {
                'Accept': 'application/json'
            }
        });

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                vendorId: response.data.d.VendorId,
                loginTime: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('Login error:', error.message);
        
        if (error.response?.status === 404) {
            return res.status(401).json({
                success: false,
                message: 'Invalid Vendor ID or Password'
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Error connecting to SAP service',
            error: error.message
        });
    }
});

// Test route
app.get('/', (req, res) => {
    res.json({
        message: 'Vendor Portal API is running',
        endpoints: {
            login: {
                method: 'POST',
                url: '/api/login',
                body: {
                    vendorId: 'string',
                    password: 'string'
                }
            }
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: err.message
    });
});

// Show all registered routes on startup
function printRoutes() {
    console.log('\nRegistered Routes:');
    app._router.stack.forEach(middleware => {
        if (middleware.route) {
            const path = middleware.route.path;
            const methods = Object.keys(middleware.route.methods);
            console.log(`${methods.join(', ').toUpperCase()} ${path}`);
        }
    });
    console.log();
}

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    
}); 


// Profile endpoint
app.get('/api/profile/:vendorId', async (req, res) => {
    const { vendorId } = req.params;

    if (!vendorId) {
        return res.status(400).json({
            success: false,
            message: 'Vendor ID is required'
        });
    }

    try {
        const response = await axios({
    method: 'get',
    url: `${SAP_CONFIG.baseURL}/sap/opu/odata/SAP/ZVVR_VEND_PROFILE_SRV/zvvr_profileSet?$filter=Lifnr eq '${vendorId}'&$format=json`,
    auth: {
        username: SAP_CONFIG.username,
        password: SAP_CONFIG.password
    },
    headers: {
        'Accept': 'application/json'
    }
});

        const results = response.data?.d?.results;

        if (!results || results.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Vendor profile not found'
            });
        }

        return res.status(200).json({
            success: true,
            data: results[0]  // Assuming only one profile per vendor
        });

    } catch (error) {
        console.error('Profile fetch error:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Error fetching vendor profile',
            error: error.message
        });
    }
});


// RFQ endpoint
app.get('/api/rfq/:vendorId', async (req, res) => {
    const { vendorId } = req.params;

    if (!vendorId) {
        return res.status(400).json({
            success: false,
            message: 'Vendor ID is required'
        });
    }

    try {
        const response = await axios({
            method: 'get',
            url: `${SAP_CONFIG.baseURL}/sap/opu/odata/SAP/ZVVR_VEND_RFQ_SRV/zvvr_rfqSet?$filter=Lifnr eq '${vendorId}'&$format=json`,
            auth: {
                username: SAP_CONFIG.username,
                password: SAP_CONFIG.password
            },
            headers: {
                'Accept': 'application/json'
            }
        });

        const results = response.data?.d?.results;

        if (!results || results.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No RFQ data found for this vendor'
            });
        }

        return res.status(200).json({
            success: true,
            data: results
        });

    } catch (error) {
        console.error('RFQ fetch error:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Error fetching vendor RFQ data',
            error: error.message
        });
    }
});

// Purchase Order endpoint
app.get('/api/purchase-orders/:vendorId', async (req, res) => {
    const { vendorId } = req.params;

    if (!vendorId) {
        return res.status(400).json({
            success: false,
            message: 'Vendor ID is required'
        });
    }

    try {
        const response = await axios({
            method: 'get',
            url: `${SAP_CONFIG.baseURL}/sap/opu/odata/SAP/ZVVR_VEND_PO_SRV/zvvr_poSet?$filter=Lifnr eq '${vendorId}'&$format=json`,
            auth: {
                username: SAP_CONFIG.username,
                password: SAP_CONFIG.password
            },
            headers: {
                'Accept': 'application/json'
            }
        });

        const results = response.data?.d?.results;

        if (!results || results.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No Purchase Order data found for this vendor'
            });
        }

        return res.status(200).json({
            success: true,
            data: results
        });

    } catch (error) {
        console.error('PO fetch error:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Error fetching vendor Purchase Order data',
            error: error.message
        });
    }
});


// Vendor Invoice endpoint
app.get('/api/invoices/:vendorId', async (req, res) => {
    const { vendorId } = req.params;

    if (!vendorId) {
        return res.status(400).json({
            success: false,
            message: 'Vendor ID is required'
        });
    }

    try {
        const response = await axios({
            method: 'get',
            url: `${SAP_CONFIG.baseURL}/sap/opu/odata/SAP/ZVVR_VEND_INVOICE_SRV/zvvr_invoiceSet?$filter=Lifnr eq '${vendorId}'&$format=json`,
            auth: {
                username: SAP_CONFIG.username,
                password: SAP_CONFIG.password
            },
            headers: {
                'Accept': 'application/json'
            }
        });

        const results = response.data?.d?.results;

        if (!results || results.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No invoice records found for the specified vendor'
            });
        }

        // Convert date fields to ISO strings (optional)
        const formattedResults = results.map(item => ({
            ...item,
            Bldat: new Date(parseInt(item.Bldat.match(/\d+/)[0], 10)).toISOString().split('T')[0],
            Eindt: item.Eindt ? new Date(parseInt(item.Eindt.match(/\d+/)[0], 10)).toISOString().split('T')[0] : null
        }));

        return res.status(200).json({
            success: true,
            data: formattedResults
        });

    } catch (error) {
        console.error('Invoice fetch error:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Error fetching vendor invoice data',
            error: error.message
        });
    }
});

// Goods Receipt endpoint
app.get('/api/goods-receipts/:vendorId', async (req, res) => {
    const { vendorId } = req.params;

    if (!vendorId || vendorId.length !== 10) {
        return res.status(400).json({
            success: false,
            message: 'A valid 10-digit Vendor ID is required'
        });
    }

    try {
        const response = await axios({
            method: 'get',
            url: `${SAP_CONFIG.baseURL}/sap/opu/odata/SAP/ZVVR_VEND_GR_SRV/zvvr_grSet?$filter=Lifnr eq '${vendorId}'&$format=json`,
            auth: {
                username: SAP_CONFIG.username,
                password: SAP_CONFIG.password
            },
            headers: {
                'Accept': 'application/json'
            }
        });

        const results = response.data?.d?.results;

        if (!results || results.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No goods receipt records found for the specified vendor'
            });
        }

        // Optionally convert date fields
        const formattedResults = results.map(item => ({
            ...item,
            Budat: new Date(parseInt(item.Budat.match(/\d+/)[0], 10)).toISOString().split('T')[0],
            Bldat: new Date(parseInt(item.Bldat.match(/\d+/)[0], 10)).toISOString().split('T')[0]
        }));

        return res.status(200).json({
            success: true,
            data: formattedResults
        });

    } catch (error) {
        console.error('Goods Receipt fetch error:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Error fetching vendor goods receipt data',
            error: error.message
        });
    }
});


// Credit/Debit Memo endpoint
app.get('/api/credit-debit-memos/:vendorId', async (req, res) => {
    const { vendorId } = req.params;

    if (!vendorId || vendorId.length !== 10) {
        return res.status(400).json({
            success: false,
            message: 'A valid 10-digit Vendor ID is required'
        });
    }

    try {
        const response = await axios({
            method: 'get',
            url: `${SAP_CONFIG.baseURL}/sap/opu/odata/SAP/ZVVR_VENDOR_CD_SRV/zvvr_vcdSet?$filter=Lifnr eq '${vendorId}'&$format=json`,
            auth: {
                username: SAP_CONFIG.username,
                password: SAP_CONFIG.password
            },
            headers: {
                'Accept': 'application/json'
            }
        });

        const results = response.data?.d?.results;

        if (!results || results.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No Credit/Debit memo records found for the specified vendor'
            });
        }

        // Optional: Format date fields for frontend
        const formattedResults = results.map(item => ({
            ...item,
            Budat: new Date(parseInt(item.Budat.match(/\d+/)[0], 10)).toISOString().split('T')[0],
            Bldat: new Date(parseInt(item.Bldat.match(/\d+/)[0], 10)).toISOString().split('T')[0]
        }));

        return res.status(200).json({
            success: true,
            data: formattedResults
        });

    } catch (error) {
        console.error('Credit/Debit Memo fetch error:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Error fetching Credit/Debit Memo data',
            error: error.message
        });
    }
});

// Vendor Payments and Aging endpoint
app.get('/api/payments-aging/:vendorId', async (req, res) => {
    const { vendorId } = req.params;

    if (!vendorId || vendorId.length !== 10) {
        return res.status(400).json({
            success: false,
            message: 'A valid 10-digit Vendor ID is required'
        });
    }

    try {
        const response = await axios({
            method: 'get',
            url: `${SAP_CONFIG.baseURL}/sap/opu/odata/SAP/ZVVR_VENDOR_PAYMENTS_SRV/zvvr_vpaymentsSet?$filter=Lifnr eq '${vendorId}'&$format=json`,
            auth: {
                username: SAP_CONFIG.username,
                password: SAP_CONFIG.password
            },
            headers: {
                'Accept': 'application/json'
            }
        });

        const results = response.data?.d?.results;

        if (!results || results.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No payment/aging records found for the specified vendor'
            });
        }

        // Convert date fields
        const formattedResults = results.map(item => ({
            ...item,
            Budat: new Date(parseInt(item.Budat.match(/\d+/)[0], 10)).toISOString().split('T')[0],
            Bldat: new Date(parseInt(item.Bldat.match(/\d+/)[0], 10)).toISOString().split('T')[0]
        }));

        return res.status(200).json({
            success: true,
            data: formattedResults
        });

    } catch (error) {
        console.error('Payments/Aging fetch error:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Error fetching vendor payment/aging data',
            error: error.message
        });
    }
});


// Vendor Invoice PDF endpoint
app.get('/api/invoice-pdf/:belnr', async (req, res) => {
    const { belnr } = req.params;

    if (!belnr || belnr.length !== 10) {
        return res.status(400).json({
            success: false,
            message: 'A valid 10-digit BELNR (Invoice Number) is required'
        });
    }

    try {
        const response = await axios({
            method: 'get',
            url: `${SAP_CONFIG.baseURL}/sap/opu/odata/SAP/ZVVR_VENDOR_INVOICEPDF_SRV_01/zvvr_invoicepdfSet('${belnr}')/$value`,
            auth: {
                username: SAP_CONFIG.username,
                password: SAP_CONFIG.password
            },
            responseType: 'arraybuffer', // Necessary for binary data
            headers: {
                'Accept': 'application/pdf'
            }
        });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename=Invoice_${belnr}.pdf`);
        return res.send(response.data);

    } catch (error) {
        console.error('Invoice PDF fetch error:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Error fetching invoice PDF from SAP',
            error: error.message
        });
    }
});
