// ========== MENU DATA ==========
const menuData = [
    // Roti Canai
    { id: 1, name: 'Roti Canai Kosong', price: 2.00, category: 'roti', icon: 'fa-bread-slice' },
    { id: 2, name: 'Roti Telur', price: 3.50, category: 'roti', icon: 'fa-egg' },
    { id: 3, name: 'Roti Bawang', price: 3.50, category: 'roti', icon: 'fa-leaf' },
    { id: 4, name: 'Roti Sardin', price: 4.50, category: 'roti', icon: 'fa-fish' },
    { id: 5, name: 'Roti Planta', price: 3.00, category: 'roti', icon: 'fa-butter' },
    { id: 6, name: 'Roti Tisu', price: 5.00, category: 'roti', icon: 'fa-scroll' },
    
    // Nasi Kandar
    { id: 7, name: 'Nasi Kandar Ayam', price: 9.50, category: 'nasi', icon: 'fa-drumstick-bite' },
    { id: 8, name: 'Nasi Kandar Daging', price: 11.00, category: 'nasi', icon: 'fa-bacon' },
    { id: 9, name: 'Nasi Kandar Ikan', price: 10.00, category: 'nasi', icon: 'fa-fish' },
    { id: 10, name: 'Nasi Kandar Sotong', price: 12.00, category: 'nasi', icon: 'fa-squid' },
    { id: 11, name: 'Nasi Goreng Mamak', price: 8.00, category: 'nasi', icon: 'fa-utensils' },
    { id: 12, name: 'Mee Goreng Mamak', price: 8.00, category: 'nasi', icon: 'fa-utensils' },
    
    // Minuman
    { id: 13, name: 'Teh Tarik', price: 2.50, category: 'minuman', icon: 'fa-mug-hot' },
    { id: 14, name: 'Teh O Ais Limau', price: 3.00, category: 'minuman', icon: 'fa-lemon' },
    { id: 15, name: 'Milo Ais', price: 3.50, category: 'minuman', icon: 'fa-mug-saucer' },
    { id: 16, name: 'Kopi O', price: 2.00, category: 'minuman', icon: 'fa-mug-hot' },
    { id: 17, name: 'Sirap Bandung', price: 3.00, category: 'minuman', icon: 'fa-wine-glass' },
    { id: 18, name: 'Air Mineral', price: 1.50, category: 'minuman', icon: 'fa-bottle-water' },
    
    // Mamak Special
    { id: 19, name: 'Maggi Goreng', price: 6.00, category: 'special', icon: 'fa-utensils' },
    { id: 20, name: 'Maggi Kuah', price: 5.50, category: 'special', icon: 'fa-bowl-food' },
    { id: 21, name: 'Roti John', price: 7.00, category: 'special', icon: 'fa-burger' },
    { id: 22, name: 'Nasi Lemak Biasa', price: 4.00, category: 'special', icon: 'fa-leaf' },
    { id: 23, name: 'Nasi Lemak Ayam', price: 8.00, category: 'special', icon: 'fa-drumstick' },
    { id: 24, name: 'Sup Kambing', price: 9.00, category: 'special', icon: 'fa-bowl-food' },
];

const categories = [
    { id: 'roti', name: 'Roti Canai', icon: 'fa-bread-slice' },
    { id: 'nasi', name: 'Nasi Kandar', icon: 'fa-utensils' },
    { id: 'minuman', name: 'Minuman', icon: 'fa-mug-hot' },
    { id: 'special', name: 'Mamak Special', icon: 'fa-crown' },
];

// ========== STATE ==========
let cart = [];
let currentCategory = 'roti';
let currentTable = 5;

// ========== DOM ELEMENTS ==========
const categoryTabs = document.getElementById('categoryTabs');
const menuGrid = document.getElementById('menuGrid');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const subtotalEl = document.getElementById('subtotal');
const taxEl = document.getElementById('tax');
const totalEl = document.getElementById('total');
const tableNumSpan = document.getElementById('tableNum');
const tableModal = document.getElementById('tableModal');
const tableInput = document.getElementById('tableInput');

// ========== INIT ==========
function init() {
    loadFromStorage();
    renderCategories();
    renderMenu();
    updateCart();
    
    // Event listeners
    document.getElementById('clearAllBtn').addEventListener('click', clearCart);
    document.getElementById('saveOrderBtn').addEventListener('click', saveOrder);
    document.getElementById('printBillBtn').addEventListener('click', printBill);
    document.querySelector('.order-badge').addEventListener('click', () => {
        tableInput.value = currentTable;
        tableModal.style.display = 'flex';
    });
    document.getElementById('closeModalBtn').addEventListener('click', () => {
        tableModal.style.display = 'none';
    });
    document.getElementById('saveTableBtn').addEventListener('click', () => {
        currentTable = parseInt(tableInput.value) || 5;
        tableNumSpan.textContent = currentTable;
        tableModal.style.display = 'none';
        saveToStorage();
    });
}

// ========== RENDER ==========
function renderCategories() {
    categoryTabs.innerHTML = categories.map(cat => `
        <button class="category-btn ${cat.id === currentCategory ? 'active' : ''}" data-category="${cat.id}">
            <i class="fas ${cat.icon}"></i>
            ${cat.name}
        </button>
    `).join('');
    
    categoryTabs.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            currentCategory = btn.dataset.category;
            renderCategories();
            renderMenu();
        });
    });
}

function renderMenu() {
    const filteredMenu = menuData.filter(item => item.category === currentCategory);
    menuGrid.innerHTML = filteredMenu.map(item => `
        <div class="menu-item" data-id="${item.id}">
            <i class="fas ${item.icon}"></i>
            <h3>${item.name}</h3>
            <span class="price">RM ${item.price.toFixed(2)}</span>
        </div>
    `).join('');
    
    menuGrid.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', () => {
            const id = parseInt(item.dataset.id);
            addToCart(id);
        });
    });
}

// ========== CART FUNCTIONS ==========
function addToCart(id) {
    const menuItem = menuData.find(m => m.id === id);
    const existing = cart.find(i => i.id === id);
    
    if (existing) {
        existing.qty++;
    } else {
        cart.push({ ...menuItem, qty: 1 });
    }
    updateCart();
}

function updateCart() {
    renderCartItems();
    updateTotals();
    saveToStorage();
}

function renderCartItems() {
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-mug-hot"></i>
                <p>Tekan menu untuk mula order</p>
            </div>
        `;
        cartCount.textContent = '0';
        return;
    }
    
    const totalItems = cart.reduce((sum, i) => sum + i.qty, 0);
    cartCount.textContent = totalItems;
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">RM ${item.price.toFixed(2)}</div>
            </div>
            <div class="cart-item-actions">
                <button class="qty-btn" data-id="${item.id}" data-action="decrease">−</button>
                <span class="qty-value">${item.qty}</span>
                <button class="qty-btn" data-id="${item.id}" data-action="increase">+</button>
                <button class="remove-btn" data-id="${item.id}"><i class="fas fa-trash"></i></button>
            </div>
        </div>
    `).join('');
    
    cartItems.querySelectorAll('[data-action="decrease"]').forEach(btn => {
        btn.addEventListener('click', () => updateQty(parseInt(btn.dataset.id), -1));
    });
    cartItems.querySelectorAll('[data-action="increase"]').forEach(btn => {
        btn.addEventListener('click', () => updateQty(parseInt(btn.dataset.id), 1));
    });
    cartItems.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', () => removeItem(parseInt(btn.dataset.id)));
    });
}

function updateQty(id, delta) {
    const item = cart.find(i => i.id === id);
    if (item) {
        item.qty += delta;
        if (item.qty <= 0) {
            cart = cart.filter(i => i.id !== id);
        }
        updateCart();
    }
}

function removeItem(id) {
    cart = cart.filter(i => i.id !== id);
    updateCart();
}

function clearCart() {
    if (confirm('Kosongkan semua order?')) {
        cart = [];
        updateCart();
    }
}

function updateTotals() {
    const subtotal = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
    const tax = subtotal * 0.06;
    const total = subtotal + tax;
    
    subtotalEl.textContent = `RM ${subtotal.toFixed(2)}`;
    taxEl.textContent = `RM ${tax.toFixed(2)}`;
    totalEl.textContent = `RM ${total.toFixed(2)}`;
}

// ========== STORAGE ==========
function saveToStorage() {
    localStorage.setItem('mamak_cart', JSON.stringify(cart));
    localStorage.setItem('mamak_table', currentTable);
}

function loadFromStorage() {
    const savedCart = localStorage.getItem('mamak_cart');
    const savedTable = localStorage.getItem('mamak_table');
    
    if (savedCart) cart = JSON.parse(savedCart);
    if (savedTable) {
        currentTable = parseInt(savedTable);
        tableNumSpan.textContent = currentTable;
    }
}

function saveOrder() {
    if (cart.length === 0) {
        alert('Order kosong!');
        return;
    }
    saveToStorage();
    alert('✅ Order disimpan! Boleh sambung kemudian.');
}

// ========== PRINT ==========
function printBill() {
    if (cart.length === 0) {
        alert('Order kosong!');
        return;
    }
    
    const subtotal = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
    const tax = subtotal * 0.06;
    const total = subtotal + tax;
    const now = new Date().toLocaleString('ms-MY');
    
    let bill = `
========================================
          MAMAK SULTAN PREMIUM
              2 Juta Ringgit
========================================
Meja: ${currentTable}    Tarikh: ${now}
----------------------------------------
ITEM               QTY   HARGA   JUMLAH
----------------------------------------
`;
    cart.forEach(item => {
        const lineTotal = item.price * item.qty;
        bill += `${item.name.padEnd(16)} ${item.qty.toString().padStart(3)}  ${item.price.toFixed(2).padStart(6)} ${lineTotal.toFixed(2).padStart(7)}\n`;
    });
    
    bill += `
----------------------------------------
Subtotal:                 RM ${subtotal.toFixed(2)}
SST (6%):                 RM ${tax.toFixed(2)}
----------------------------------------
TOTAL:                    RM ${total.toFixed(2)}
========================================
       TERIMA KASIH, SILA DATANG LAGI
========================================
`;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`<pre style="font-family: monospace; font-size: 14px;">${bill}</pre>`);
    printWindow.document.close();
    printWindow.print();
}

// Start app
init();