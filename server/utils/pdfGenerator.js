const PDFDocument = require('pdfkit');
const Order = require('../models/Order');

function generateReceiptPDF(order, user) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const chunks = [];

      doc.on('data', chunks.push.bind(chunks));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(chunks);
        resolve(pdfBuffer);
      });
      doc.on('error', reject);

      // Header
      doc.fontSize(24).font('Helvetica-Bold').text('Smart Grocery Store', { align: 'center' });
      doc.moveDown(0.5);
      doc.fontSize(12).font('Helvetica').text('Your Smart Shopping Partner', { align: 'center' });
      doc.moveDown(1);

      // Order Details
      doc.fontSize(16).font('Helvetica-Bold').text('Order Receipt', { underline: true });
      doc.moveDown(0.5);
      
      const orderId = order.generateOrderId ? order.generateOrderId() : `ORD-${order._id.toString().slice(-8).toUpperCase()}`;
      doc.fontSize(10).font('Helvetica');
      doc.text(`Order ID: ${orderId}`);
      doc.text(`Date: ${new Date(order.createdAt).toLocaleString()}`);
      doc.text(`Status: ${order.status.toUpperCase()}`);
      doc.moveDown(1);

      // Customer Details
      doc.fontSize(14).font('Helvetica-Bold').text('Customer Details', { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(10).font('Helvetica');
      doc.text(`Name: ${user.name}`);
      doc.text(`Email: ${user.email}`);
      if (user.phone) doc.text(`Phone: ${user.phone}`);
      
      if (order.shippingAddress) {
        doc.moveDown(0.5);
        doc.text('Shipping Address:');
        if (order.shippingAddress.street) doc.text(`  ${order.shippingAddress.street}`);
        if (order.shippingAddress.city) doc.text(`  ${order.shippingAddress.city}, ${order.shippingAddress.state || ''} ${order.shippingAddress.zipCode || ''}`);
      }
      doc.moveDown(1);

      // Items Table
      doc.fontSize(14).font('Helvetica-Bold').text('Order Items', { underline: true });
      doc.moveDown(0.5);

      // Table Header
      const tableTop = doc.y;
      doc.fontSize(10).font('Helvetica-Bold');
      doc.text('Item', 50, tableTop);
      doc.text('Variant', 200, tableTop);
      doc.text('Qty', 300, tableTop);
      doc.text('Price', 350, tableTop);
      doc.text('Total', 420, tableTop);

      // Table Rows
      let yPos = tableTop + 20;
      doc.font('Helvetica');
      order.items.forEach((item, index) => {
        if (yPos > 700) {
          doc.addPage();
          yPos = 50;
        }
        doc.fontSize(9).text(item.name || 'Product', 50, yPos);
        doc.text(item.variant || '-', 200, yPos);
        doc.text(item.quantity.toString(), 300, yPos);
        doc.text(`₹${item.price.toFixed(2)}`, 350, yPos);
        doc.text(`₹${item.total.toFixed(2)}`, 420, yPos);
        yPos += 20;
      });

      doc.moveDown(1);

      // Totals
      const totalsY = doc.y;
      doc.fontSize(10).font('Helvetica');
      doc.text('Subtotal:', 350, totalsY);
      doc.text(`₹${order.subtotal.toFixed(2)}`, 420, totalsY);
      
      if (order.tax > 0) {
        doc.text('Tax (5%):', 350, totalsY + 20);
        doc.text(`₹${order.tax.toFixed(2)}`, 420, totalsY + 20);
      }

      doc.fontSize(12).font('Helvetica-Bold');
      doc.text('Total:', 350, totalsY + 40);
      doc.text(`₹${order.total.toFixed(2)}`, 420, totalsY + 40);

      doc.moveDown(2);

      // Payment Info
      doc.fontSize(10).font('Helvetica');
      doc.text(`Payment Method: ${order.paymentMethod.replace(/_/g, ' ').toUpperCase()}`);
      doc.text(`Payment Status: ${order.paymentStatus.toUpperCase()}`);

      if (order.isOCRGenerated) {
        doc.moveDown(0.5);
        doc.fontSize(9).font('Helvetica-Oblique').text('* This order was generated from an uploaded shopping list', { color: 'gray' });
      }

      doc.moveDown(2);

      // Footer
      doc.fontSize(8).font('Helvetica').text('Thank you for shopping with us!', { align: 'center' });
      doc.text('For any queries, contact us at support@smartgrocery.com', { align: 'center' });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = { generateReceiptPDF };
