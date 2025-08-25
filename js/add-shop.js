import { addShop, shopAdded } from "./firestore.js"

const shopNameInput = document.querySelector('#shopName')
const lastOCInput = document.querySelector('#lastOwnerChange')
const ownerNameInput = document.querySelector('#ownerName')
const contactNumberInput = document.querySelector('#contactNumber')
const regDateInput = document.querySelector('#registrationDate')
const monthlyAmountInput = document.querySelector('#monthlyAmount')
const dueDateInput = document.querySelector('#dueDate')
const lastPaymentInput = document.querySelector('#lastPayment')
const outAmountInput = document.querySelector('#outstandingAmount')
// Shop number input + preview
const shopNoPreview = document.querySelector('.shop-number-preview').children[1]
const shopNumberInput = document.querySelector('#shopNumber')

shopNumberInput.addEventListener('input', function () {
    this.value = this.value.toUpperCase();      // force uppercase in input
    shopNoPreview.textContent = this.value;     // update preview
})

const addShopForm = document.querySelector('form')

let duesStatus ;

if(outAmountInput.value == 0){
    duesStatus = 'All Clear'
}else{
    duesStatus = 'Pending'
}

addShopForm.addEventListener('submit', async function(e){
    e.preventDefault()

    const shopInfo = {
        shopNumber: shopNumberInput.value,
        shopName: shopNameInput.value,
        lastOwnerChange: lastOCInput.value,
    }

    const ownerInfo = {
        ownerName: ownerNameInput.value,
        contactNumber: contactNumberInput.value,
        registrationDate: regDateInput.value,
    }
    
    const duesInfo = {
        monthlyAmount: monthlyAmountInput.value,
        outstandingAmount: outAmountInput.value,
        dueDate: dueDateInput.value,
        lastPayment: lastPaymentInput.value,
        duesStatus: duesStatus
    }

    const addShopSuccess = await addShop(shopInfo, ownerInfo, duesInfo)

    if (addShopSuccess) {
        showSuccessSwal();
        document.querySelector("#swalBtnSuccess").addEventListener("click", () => {
            closeSwal('success')
            window.location.href = 'shops.html'
        })
    } else {
        showErrorSwal();
        document.querySelector("#swalBtnError").addEventListener("click", () => closeSwal('error'))
    }
})


function showSuccessSwal() {
    document.getElementById('swalSuccessModal').classList.add('show');
    document.body.style.overflow = 'hidden';
}

function showErrorSwal() {
    document.getElementById('swalErrorModal').classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeSwal(type) {
    const modal = type === 'error' ? 
        document.getElementById('swalErrorModal') : 
        document.getElementById('swalSuccessModal');
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
}
