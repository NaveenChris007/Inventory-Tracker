// ============================================================
// INVENTORY TRACKER — Google Apps Script Backend
// ============================================================
// SETUP:
// 1. Open your Google Sheet (the Inventory Tracker)
// 2. Go to Extensions → Apps Script
// 3. Delete any existing code, paste this entire file
// 4. Click Deploy → New Deployment
// 5. Type: Web app
// 6. Execute as: Me
// 7. Who has access: Anyone
// 8. Click Deploy, copy the URL
// 9. Paste that URL into the mobile app Settings page
// ============================================================

// Sheet names (must match your spreadsheet tabs exactly)
const SHEET_PRODUCTS = 'Products';
const SHEET_SALESPERSONS = 'Salespersons';
const SHEET_SALES = 'Sales';
const SHEET_STOCK_IN = 'Stock In';
const SHEET_CUSTOMERS = 'Customers';

// Data starts at row 5 in all sheets (row 4 = headers)
const DATA_START_ROW = 5;

// Test function to verify permissions and sheet access
function testSubmitSale() {
  const testData = {
    invoiceNo: 'TEST-001',
    date: '2026-02-06',
    customer: 'Test Customer',
    salesperson: 'Test User',
    items: [
      {
        productId: 'P001',
        productName: 'Test Product',
        qty: 1,
        unitPrice: 10.00
      }
    ],
    remarks: 'Test submission from Apps Script'
  };

  const result = submitSale(testData);
  Logger.log(result);
  return result;
}

function doGet(e) {
  const action = e.parameter.action;
  let result;

  try {
    switch (action) {
      case 'getInitialData':
        result = getInitialData();
        break;
      case 'getProducts':
        result = getProducts();
        break;
      case 'getSalespersons':
        result = getSalespersons();
        break;
      case 'getCustomers':
        result = getCustomers();
        break;
      case 'getDashboard':
        result = getDashboard();
        break;
      case 'getRecentSales':
        result = getRecentSales();
        break;
      default:
        result = { error: 'Unknown action: ' + action };
    }
  } catch (err) {
    result = { error: err.toString() };
  }

  const output = ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);

  return output;
}

function doPost(e) {
  const action = e.parameter.action;
  let result;

  try {
    const data = JSON.parse(e.postData.contents);

    switch (action) {
      case 'submitSale':
        result = submitSale(data);
        break;
      case 'submitStockIn':
        result = submitStockIn(data);
        break;
      case 'addCustomer':
        result = addCustomer(data);
        break;
      default:
        result = { error: 'Unknown action: ' + action };
    }
  } catch (err) {
    result = { error: err.toString() };
  }

  const output = ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);

  return output;
}

// ── GET INITIAL DATA (Batched) ──
// Returns products, salespersons, and customers in a single call
function getInitialData() {
  return {
    products: getProducts().products || [],
    salespersons: getSalespersons().salespersons || [],
    customers: getCustomers().customers || []
  };
}

// ── GET PRODUCTS ──
function getProducts() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_PRODUCTS);
  const lastRow = sheet.getLastRow();

  if (lastRow < DATA_START_ROW) return { products: [] };

  const data = sheet.getRange(DATA_START_ROW, 1, lastRow - DATA_START_ROW + 1, 9).getValues();

  const products = data
    .filter(row => row[0] !== '' && row[8] !== 'No') // Skip empty and inactive
    .map(row => ({
      id: row[0],         // Product ID
      name: row[1],       // Product Name
      sku: row[2],        // SKU
      category: row[3],   // Category
      unit: row[4],       // Unit
      unitCost: row[5],   // Unit Cost
      sellingPrice: row[6], // Selling Price
      reorderLevel: row[7], // Reorder Level
    }));

  return { products };
}

// ── GET SALESPERSONS ──
function getSalespersons() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_SALESPERSONS);
  const lastRow = sheet.getLastRow();

  if (lastRow < DATA_START_ROW) return { salespersons: [] };

  const data = sheet.getRange(DATA_START_ROW, 1, lastRow - DATA_START_ROW + 1, 3).getValues();

  const salespersons = data
    .filter(row => row[0] !== '' && row[2] === 'Active')
    .map(row => ({
      name: row[0],
      role: row[1],
    }));

  return { salespersons };
}

// ── GET CUSTOMERS ──
function getCustomers() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_CUSTOMERS);

  if (!sheet) {
    // If Customers sheet doesn't exist yet, return empty array
    return { customers: [] };
  }

  const lastRow = sheet.getLastRow();

  if (lastRow < DATA_START_ROW) return { customers: [] };

  const data = sheet.getRange(DATA_START_ROW, 1, lastRow - DATA_START_ROW + 1, 4).getValues();

  const customers = data
    .filter(row => row[0] !== '' && row[3] === 'Active')
    .map(row => ({
      id: row[0],           // Customer ID
      name: row[1],         // Customer Name
      contactPerson: row[2], // Contact Person
    }));

  return { customers };
}

// ── ADD CUSTOMER ──
// Expects: { name, contactPerson }
function addCustomer(data) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_CUSTOMERS);

    // If Customers sheet doesn't exist, create it
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_CUSTOMERS);
      // Add headers
      sheet.getRange(4, 1, 1, 4).setValues([['Customer ID', 'Customer Name', 'Contact Person', 'Status (Active/Inactive)']]);
      sheet.getRange(4, 1, 1, 4).setFontWeight('bold');
    }

    // Check if customer already exists
    const lastRow = sheet.getLastRow();
    if (lastRow >= DATA_START_ROW) {
      const existingCustomers = sheet.getRange(DATA_START_ROW, 2, lastRow - DATA_START_ROW + 1, 1).getValues();
      const isDuplicate = existingCustomers.some(row => row[0] && row[0].toString().toLowerCase() === data.name.toLowerCase());
      if (isDuplicate) {
        return { error: 'Customer "' + data.name + '" already exists' };
      }
    }

    // Generate customer ID (CUST-001, CUST-002, etc.)
    const customerCount = lastRow < DATA_START_ROW ? 0 : lastRow - DATA_START_ROW + 1;
    const customerId = 'CUST-' + String(customerCount + 1).padStart(3, '0');

    // Add new customer
    const newRow = [
      customerId,
      data.name,
      data.contactPerson || '',
      'Active'
    ];

    const startRow = lastRow < DATA_START_ROW ? DATA_START_ROW : lastRow + 1;
    sheet.getRange(startRow, 1, 1, 4).setValues([newRow]);

    return {
      success: true,
      customer: {
        id: customerId,
        name: data.name,
        contactPerson: data.contactPerson || ''
      }
    };
  } catch (error) {
    return { error: 'Failed to add customer: ' + error.toString() };
  }
}

// ── SUBMIT SALE ──
// Expects: { invoiceNo, date, customer, salesperson, items: [{ productId, productName, qty, unitPrice }], remarks }
function submitSale(data) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_SALES);

    if (!sheet) {
      return { error: 'Sales sheet not found. Expected sheet name: "' + SHEET_SALES + '"' };
    }

    // Check for duplicate invoice number
    const lastRow = sheet.getLastRow();
    if (lastRow >= DATA_START_ROW) {
      const invoiceNumbers = sheet.getRange(DATA_START_ROW, 1, lastRow - DATA_START_ROW + 1, 1).getValues();
      const isDuplicate = invoiceNumbers.some(row => row[0] === data.invoiceNo);
      if (isDuplicate) {
        return { error: 'Invoice number "' + data.invoiceNo + '" already exists. Please use a different invoice number.' };
      }
    }

    const entryTime = new Date();
    const entryTimeStr = Utilities.formatDate(entryTime, Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss');

    const rows = data.items.map(item => [
      data.invoiceNo,
      new Date(data.date),
      data.customer,
      data.salesperson,
      item.productId,
      item.productName,
      item.qty,
      item.unitPrice,
      item.qty * item.unitPrice, // Line Total
      entryTimeStr,
      data.remarks || ''
    ]);

    if (rows.length === 0) return { error: 'No items to submit' };

    const startRow = lastRow + 1;

    sheet.getRange(startRow, 1, rows.length, 11).setValues(rows);

    // Format the date column
    sheet.getRange(startRow, 2, rows.length, 1).setNumberFormat('yyyy-MM-dd');
    // Format currency columns
    sheet.getRange(startRow, 8, rows.length, 1).setNumberFormat('$#,##0.00');
    sheet.getRange(startRow, 9, rows.length, 1).setNumberFormat('$#,##0.00');

    return {
      success: true,
      invoiceNo: data.invoiceNo,
      itemCount: rows.length,
      total: rows.reduce((sum, r) => sum + r[8], 0),
      entryTime: entryTimeStr,
      writtenToRow: startRow
    };
  } catch (error) {
    return { error: 'Failed to write to sheet: ' + error.toString() };
  }
}

// ── SUBMIT STOCK IN ──
// Expects: { refNo, date, productId, productName, qty, supplier, costPerUnit, receivedBy, remarks }
function submitStockIn(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_STOCK_IN);
  const lastRow = sheet.getLastRow();

  const row = [
    data.refNo,
    new Date(data.date),
    data.productId,
    data.productName,
    data.qty,
    data.supplier,
    data.costPerUnit,
    data.qty * data.costPerUnit, // Total Cost
    data.receivedBy,
    data.remarks || ''
  ];

  sheet.getRange(lastRow + 1, 1, 1, 10).setValues([row]);
  sheet.getRange(lastRow + 1, 2, 1, 1).setNumberFormat('yyyy-MM-dd');
  sheet.getRange(lastRow + 1, 7, 1, 1).setNumberFormat('$#,##0.00');
  sheet.getRange(lastRow + 1, 8, 1, 1).setNumberFormat('$#,##0.00');

  return { success: true, refNo: data.refNo };
}

// ── GET DASHBOARD DATA ──
function getDashboard() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // Get products
  const prodSheet = ss.getSheetByName(SHEET_PRODUCTS);
  const prodLastRow = prodSheet.getLastRow();
  const products = prodLastRow >= DATA_START_ROW
    ? prodSheet.getRange(DATA_START_ROW, 1, prodLastRow - DATA_START_ROW + 1, 9).getValues()
    : [];

  // Get stock in
  const siSheet = ss.getSheetByName(SHEET_STOCK_IN);
  const siLastRow = siSheet.getLastRow();
  const stockIn = siLastRow >= DATA_START_ROW
    ? siSheet.getRange(DATA_START_ROW, 1, siLastRow - DATA_START_ROW + 1, 10).getValues()
    : [];

  // Get sales
  const salesSheet = ss.getSheetByName(SHEET_SALES);
  const salesLastRow = salesSheet.getLastRow();
  const sales = salesLastRow >= DATA_START_ROW
    ? salesSheet.getRange(DATA_START_ROW, 1, salesLastRow - DATA_START_ROW + 1, 11).getValues()
    : [];

  // Calculate stock per product
  const stockMap = {};

  products.forEach(row => {
    if (row[0] === '' || row[8] === 'No') return;
    stockMap[row[0]] = {
      id: row[0],
      name: row[1],
      sku: row[2],
      category: row[3],
      unit: row[4],
      unitCost: row[5],
      sellingPrice: row[6],
      reorderLevel: row[7],
      totalIn: 0,
      totalOut: 0,
      onHand: 0,
      status: 'OK'
    };
  });

  stockIn.forEach(row => {
    const pid = row[2]; // Product ID column
    if (stockMap[pid]) {
      stockMap[pid].totalIn += (row[4] || 0); // Qty column
    }
  });

  sales.forEach(row => {
    const pid = row[4]; // Product ID column
    if (stockMap[pid]) {
      stockMap[pid].totalOut += (row[6] || 0); // Qty column
    }
  });

  const dashboard = Object.values(stockMap).map(p => {
    p.onHand = p.totalIn - p.totalOut;
    p.status = p.onHand <= p.reorderLevel ? 'LOW' : 'OK';
    return p;
  });

  // Summary KPIs
  const totalRevenue = sales.reduce((sum, row) => sum + (row[8] || 0), 0);
  const uniqueInvoices = [...new Set(sales.filter(r => r[0] !== '').map(r => r[0]))].length;
  const lowStockCount = dashboard.filter(p => p.status === 'LOW').length;

  // Customer stats
  const customerStats = {};
  sales.forEach(row => {
    const customer = row[2]; // Customer column
    if (!customer || customer === '') return;

    if (!customerStats[customer]) {
      customerStats[customer] = {
        name: customer,
        totalPurchases: 0,
        invoiceCount: 0,
        invoices: new Set()
      };
    }

    customerStats[customer].totalPurchases += (row[8] || 0); // Line Total
    customerStats[customer].invoices.add(row[0]); // Invoice No
  });

  const topCustomers = Object.values(customerStats)
    .map(c => ({
      name: c.name,
      totalPurchases: c.totalPurchases,
      invoiceCount: c.invoices.size
    }))
    .sort((a, b) => b.totalPurchases - a.totalPurchases)
    .slice(0, 10);

  return {
    items: dashboard,
    kpi: {
      totalSKUs: dashboard.length,
      totalOnHand: dashboard.reduce((sum, p) => sum + p.onHand, 0),
      lowStockCount,
      totalRevenue,
      totalInvoices: uniqueInvoices,
      inventoryValue: dashboard.reduce((sum, p) => sum + (p.onHand * p.unitCost), 0)
    },
    topCustomers
  };
}

// ── GET RECENT SALES ──
function getRecentSales() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_SALES);
  const lastRow = sheet.getLastRow();

  if (lastRow < DATA_START_ROW) return { sales: [] };

  const data = sheet.getRange(DATA_START_ROW, 1, lastRow - DATA_START_ROW + 1, 11).getValues();

  // Group by invoice
  const invoiceMap = {};
  data.forEach(row => {
    if (row[0] === '') return;
    const inv = row[0];
    if (!invoiceMap[inv]) {
      invoiceMap[inv] = {
        invoiceNo: inv,
        date: row[1] instanceof Date ? Utilities.formatDate(row[1], Session.getScriptTimeZone(), 'yyyy-MM-dd') : row[1],
        customer: row[2],
        salesperson: row[3],
        items: [],
        total: 0
      };
    }
    invoiceMap[inv].items.push({
      productId: row[4],
      productName: row[5],
      qty: row[6],
      unitPrice: row[7],
      lineTotal: row[8]
    });
    invoiceMap[inv].total += (row[8] || 0);
  });

  // Sort by date descending, return last 20
  const invoices = Object.values(invoiceMap)
    .sort((a, b) => b.date > a.date ? 1 : -1)
    .slice(0, 20);

  return { sales: invoices };
}
