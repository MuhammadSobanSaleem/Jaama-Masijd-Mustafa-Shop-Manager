import { getDocument } from './firestore.js'

const urlParams = new URLSearchParams(window.location.search)
const shopId = urlParams.get('id')

async function getDoc() {
    const doc = await getDocument(shopId)

    // Owner Info
    const ownerName = doc.ownerInfo.ownerName
    const contactNumber = doc.ownerInfo.contactNumber
    const regDate = doc.ownerInfo.registrationDate
    
    // Shop Info
    const shopName = doc.shopInfo.shopName
    const shopNumber = doc.shopInfo.shopNumber
    const lastOwnerChange = doc.shopInfo.lastOwnerChange
    
    // Dues Info
    const monthlyAmount = doc.duesInfo.monthlyAmount
    const outstandingAmount = Number(doc.duesInfo.outstandingAmount)
    const lastPayment = doc.duesInfo.lastPayment
    const dueDay = Number(doc.duesInfo.dueDate)
    const duesStatus  = doc.duesInfo.outstandingAmount === 0 ? "Paid" : "Pending"

    // Add suffixes eg; st, nd, rd, th after due date according to the ending and single digits
    function dueDaySuffix(dueDay){

        const lastDigit = dueDay.toString().slice(-1)

        if(dueDay == 1 || lastDigit == 1){
            return "st"
        }else if(dueDay == 2 || lastDigit == 2){
            return "nd"
        }else if(dueDay == 3 || lastDigit == 3){
            return "rd"
        }else{
            return "th"
        }
        
    }
    

    // Overdue Days Calculator eg; 2 year(s) 4 month(s) 20 day(s)
    function overDueCalc(){
        const today = new Date()
        
        const part = lastPayment.split("-")
        const lastPaymentDate = new Date(part[0], part[1], part[2])
        const totalDays = Number((today - lastPaymentDate) / (1000 * 60 * 60 * 24)).toFixed()

        const years = Math.floor(totalDays / 365)
        const yearsRemainder = totalDays % 365
        
        const months = Math.floor(yearsRemainder / 30)
        const days = yearsRemainder % 30
        
        const yearsFormatted = years > 0 ? `${years} year(s)`: `` 
        const monthsFormatted = months > 0 ? ` ${months} month(s)` : ``
        const daysFormatted = ` ${days} day(s)`
        
        const overDue = yearsFormatted + monthsFormatted + daysFormatted

        return overDue
            
    }
    const overDue = overDueCalc()

    // Date formatter;

    function dateFormatter(dateInput){
        
        const input = dateInput;
    
        // Split into parts
        const parts = input.split("-"); // ["2025", "08", "15"]
    
        // Date with year, month-1, day (local date)
        const date = new Date(parts[0], parts[1] - 1, parts[2]);
    
        // Format
    
        const options = { 
            year: "numeric", 
            month: "long", 
            day: "numeric" 
        }
    
        const formattedDate = date.toLocaleDateString("en-US", options); // "August 15, 2025"

        return formattedDate;

    }

    const regDateFormatted = dateFormatter(regDate)
    const lastOwnerChangeFormatted = dateFormatter(lastOwnerChange)
    const lastPaymentFormatted = dateFormatter(lastPayment)


    const container = document.querySelector('.container')

    container.innerHTML = `
            <div class="header">
                <h1>Shop Details</h1>
                <div class="breadcrumb">
                    <a href="#">Home</a> / <a href="#">Shops</a> / Shop Details
                </div>
            </div>

            <div class="main-content">
                <!-- Shop Owner Card -->
                <div class="card">
                    <div class="card-header">
                        <div class="card-icon owner-icon">👤</div>
                        <div class="card-title">Shop Owner</div>
                    </div>
                    <div class="info-group">
                        <div class="info-label">Owner Name</div>
                        <div class="info-value">${ownerName}</div>
                    </div>
                    <div class="info-group">
                        <div class="info-label">Contact Number</div>
                        <div class="info-value">${contactNumber}</div>
                    </div>
                    <div class="info-group">
                        <div class="info-label">Shop Name</div>
                        <div class="info-value">${shopName}</div>
                    </div>
                    <div class="info-group">
                        <div class="info-label">Registration Date</div>
                        <div class="info-value">${regDateFormatted}</div>
                    </div>
                    <div class="info-group">
                        <div class="info-label">Status</div>
                        <span class="status-badge status-paid">Active</span>
                    </div>
                </div>

                <!-- Shop Number Card -->
                <div class="card" style="display: flex; flex-direction: column; min-height: 200px;">
                    <div class="card-header">
                        <div class="card-icon contact-icon">#️⃣</div>
                        <div class="card-title">Shop Number</div>
                    </div>
                    <div style="display: flex; justify-content: center; align-items: center; flex: 1; flex-direction: column;">
                        <div style="font-size: 72px; font-weight: 700; margin-bottom: 16px;">
                            <span style="color: #38a169;">#</span><span style="color: #667eea;">${shopNumber}</span>
                        </div>
                        <div class="info-group" style="text-align: center; margin-bottom: 0;">
                            <div class="info-label">Last Owner Change</div>
                            <div class="info-value">${lastOwnerChangeFormatted}</div>
                        </div>
                    </div>
                </div>

                <!-- Monthly Dues Card -->
                <div class="card">
                    <div class="card-header">
                        <div class="card-icon monthly-icon">💰</div>
                        <div class="card-title">Monthly Dues</div>
                    </div>
                    <div class="info-group">
                        <div class="info-label">Monthly Amount</div>
                        <div class="info-value amount positive">${Number(monthlyAmount).toLocaleString("en-PK", {style: 'currency', currency: 'PKR', maximumFractionDigits: 0})}</div>
                    </div>
                    <div class="info-group">
                        <div class="info-label">Due Date</div>
                        <div class="info-value">${dueDay}${dueDaySuffix(dueDay)} of each month</div>
                    </div>
                    <div class="info-group">
                        <div class="info-label">Last Payment</div>
                        <div class="info-value">${lastPaymentFormatted}</div>
                    </div>
                    <div class="info-group">
                        <div class="info-label">Payment Status</div>
                        <span class="status-badge status-${duesStatus.toLowerCase()}">${duesStatus}</span>
                    </div>
                </div>

                <!-- Pending Dues Card -->
                <div class="card">
                    <div class="card-header">
                        <div class="card-icon pending-icon">⚠️</div>
                        <div class="card-title">Pending Dues</div>
                    </div>
                    <div class="info-group">
                        <div class="info-label">Outstanding Amount</div>
                        <div class="info-value amount negative">${Number(outstandingAmount).toLocaleString("en-PK", {style: 'currency', currency: 'PKR', maximumFractionDigits: 0})}</div>
                    </div>
                    <div class="info-group">
                        <div class="info-label">Overdue Days</div>
                        <div class="info-value">${overDue}</div>
                    </div>
                    <div class="info-group">
                        <div class="info-label">Late Fees</div>
                        <div class="info-value">Rs.0.00</div>
                    </div>
                    <div class="info-group">
                        <div class="info-label">Payment Status</div>
                        <span class="status-badge status-${duesStatus.toLowerCase()}">${duesStatus == "Paid" ? "Up to Date" : "Pending"}</span>
                    </div>
                </div>
            </div>

            <!-- Actions Section -->
            <div class="actions-section">
                <div class="actions-header">Quick Actions</div>
                <div class="action-buttons">
                    <button class="btn btn-primary">
                        📞 Contact Support
                    </button>
                    <button class="btn btn-info">
                        📊 View History
                    </button>
                    <button class="btn btn-success">
                        💳 Make Payment
                    </button>
                    <button class="btn btn-secondary">
                        💸 View Payments
                    </button>
                </div>
            </div>
            `

}

getDoc()