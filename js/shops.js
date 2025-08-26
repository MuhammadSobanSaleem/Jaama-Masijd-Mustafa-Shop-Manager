import { getAllData, deleteShop } from "./firestore.js"

// Configuration - Set your admin password here
const ADMIN_PASSWORD = "admin123"; // ⚠️ CHANGE THIS!
let currentShopData = null;


async function showShopInList() {
    const allData = await getAllData();
    
    // ✅ Sort shops by shop number before displaying
    const sortedShops = sortShopsByNumber(allData);
    
    const shopList = document.querySelector(".shops-list")
    
    // Clear existing content except header
    const listHeader = shopList.querySelector('.list-header');
    shopList.innerHTML = '';
    if (listHeader) {
        shopList.appendChild(listHeader);
    }
    
    // Build all HTML at once with sorted data
    let shopsHTML = '';
    sortedShops.forEach(shop => {
        let duesStatus;
        let duesStatusClass;
        if(shop.duesInfo.outstandingAmount == 0){
            duesStatus = "All Clear"
            duesStatusClass = "status-clear"
        }else{
            duesStatus = "Pending"
            duesStatusClass = "status-pending"
        }
        
        shopsHTML += `<div class="shop-row">
        <div class="shop-number">
            <span class="hash">#</span>${shop.shopInfo.shopNumber}
        </div>
        <div class="owner-info">
            <div class="owner-name">${shop.ownerInfo.ownerName}</div>
            <div class="shop-name">${shop.shopInfo.shopName}</div>
        </div>
        <div class="dues-status ${duesStatusClass}">${duesStatus}</div>
        <div class="shop-actions"
        data-id="${shop.id}">
            <button class="action-btn btn-details">Details</button>
            <button class="action-btn btn-edit">Edit</button>
            <button class="action-btn btn-delete">Delete</button>
        </div>
        </div>`;
    });
    
    // Set all HTML at once
    shopList.innerHTML += shopsHTML;
    
    // Use event delegation for delete buttons
    shopList.addEventListener('click', (e) => {
        const actions = e.target.closest('.shop-actions');
        if (!actions) return; // click outside buttons

        const shopId = actions.dataset.id;

        if (e.target.classList.contains('btn-delete')) {
            currentShopData = { id: shopId, shopNumber: shopId };
            showDeleteConfirmation(currentShopData.shopNumber);
        } 
        else if (e.target.classList.contains('btn-details')) {
            window.location.href = `shop-details.html?id=${shopId}`;
        } 
        else if (e.target.classList.contains('btn-edit')) {
            window.location.href = `edit-shop.html?id=${shopId}`;
        }
    });

}

// Custom sorting function for shop numbers
function sortShopsByNumber(shops) {
    return shops.sort((a, b) => {
        const shopA = a.shopInfo.shopNumber.toString().toUpperCase();
        const shopB = b.shopInfo.shopNumber.toString().toUpperCase();
        
        // Extract numeric and letter parts
        const parseShopNumber = (shopNum) => {
            const match = shopNum.match(/^(\d+)([A-Z]?)$/);
            if (match) {
                return {
                    number: parseInt(match[1]),
                    letter: match[2] || '' // Empty string if no letter
                };
            }
            // Fallback for unexpected formats
            return { number: 0, letter: shopNum };
        };
        
        const parsedA = parseShopNumber(shopA);
        const parsedB = parseShopNumber(shopB);
        
        // First, sort by number
        if (parsedA.number !== parsedB.number) {
            return parsedA.number - parsedB.number;
        }
        
        // If numbers are equal, sort by letter
        // Empty letter (pure numbers) come first
        if (parsedA.letter === '' && parsedB.letter !== '') return -1;
        if (parsedA.letter !== '' && parsedB.letter === '') return 1;
        
        // Both have letters, sort alphabetically
        return parsedA.letter.localeCompare(parsedB.letter);
    });
}

function showDeleteConfirmation(shopNumber) {
    document.getElementById('deleteShopNumber').textContent = '#' + shopNumber;
    document.getElementById('adminPassword').value = 'admin123';
    clearPasswordError();
    const modal = document.getElementById('swalDeleteModal');
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
   
    setTimeout(() => {
        document.getElementById('adminPassword').focus();
    }, 300);
}

async function verifyPasswordAndDelete() {
    const passwordInput = document.getElementById('adminPassword');
    const deleteButton = document.getElementById('deleteButton');
    const enteredPassword = passwordInput.value.trim();

    clearPasswordError();

    if (!enteredPassword) {
        showPasswordError("Please enter the admin password");
        passwordInput.focus();
        return;
    }

    setButtonLoading(deleteButton, true);
    await new Promise(resolve => setTimeout(resolve, 500));

    if (enteredPassword === ADMIN_PASSWORD) {
        setButtonLoading(deleteButton, false);
        closeSwal('delete');
        
        try {
            await deleteShop(currentShopData.id);
            setTimeout(() => {
                showDeleteSuccess(currentShopData.shopNumber);
            }, 300);
        } catch (error) {
            console.error('Delete failed:', error);
            alert('Delete failed. Please try again.');
            setButtonLoading(deleteButton, false);
        }
    } else {
        setButtonLoading(deleteButton, false);
        showPasswordError("Incorrect password. Please try again.");
        passwordInput.focus();
        passwordInput.select();
    }
}

function showDeleteSuccess(shopNumber) {
    document.getElementById('deletedShopNumber').textContent = '#' + shopNumber;
    const modal = document.getElementById('swalDeleteSuccessModal');
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function showPasswordError(message) {
    const errorDiv = document.getElementById('passwordError');
    const passwordInput = document.getElementById('adminPassword');
    
    errorDiv.textContent = message;
    errorDiv.classList.add('show');
    passwordInput.classList.add('error');
}

function clearPasswordError() {
    const errorDiv = document.getElementById('passwordError');
    const passwordInput = document.getElementById('adminPassword');
    
    if (errorDiv) errorDiv.classList.remove('show');
    if (passwordInput) passwordInput.classList.remove('error');
}

function setButtonLoading(button, loading) {
    if (loading) {
        button.classList.add('loading');
        button.disabled = true;
    } else {
        button.classList.remove('loading');
        button.disabled = false;
    }
}

function closeSwal(type) {
    let modal;
    switch(type) {
        case 'delete':
            modal = document.getElementById('swalDeleteModal');
            break;
        case 'deleteSuccess':
            modal = document.getElementById('swalDeleteSuccessModal');
            break;
    }
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
        
        if (type === 'delete') {
            document.getElementById('adminPassword').value = '';
            clearPasswordError();
        }
        
        if (type === 'deleteSuccess') {
            location.reload();
        }
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    const passwordInput = document.getElementById('adminPassword');
    if (passwordInput) {
        passwordInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                verifyPasswordAndDelete();
            }
        });
    }

    const deleteModal = document.getElementById('swalDeleteModal');
    const successModal = document.getElementById('swalDeleteSuccessModal');
    
    if (deleteModal) {
        deleteModal.addEventListener('click', function(e) {
            if (e.target === this) closeSwal('delete');
        });
    }
    
    if (successModal) {
        successModal.addEventListener('click', function(e) {
            if (e.target === this) closeSwal('deleteSuccess');
        });
    }

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeSwal('delete');
            closeSwal('deleteSuccess');
        }
    });
});

// Make functions global
window.verifyPasswordAndDelete = verifyPasswordAndDelete;
window.closeSwal = closeSwal;

// Initialize
showShopInList();