 <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
    <!-- =================================================================
         SECTION 2: JAVASCRIPT LOGIC
    ================================================================= -->
    <script>
        document.addEventListener('DOMContentLoaded', function() {
    
            // =================================================================
            // STEP 1: CONFIGURE YOUR PRODUCTS AND KEYS HERE
            // =================================================================
    
            // ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼
            // IMPORTANT: YOU MUST REPLACE THE TEXT BELOW WITH YOUR REAL RAZORPAY KEY ID
            // =================================================================
            const RAZORPAY_KEY_ID = "rzp_live_iwzig23hBqUD90";
            // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲
    
            // Define all your products in one place
            const products = [
                { id: "c_notes", name: "C Language Notes", price: 900, details: ["C NOTES (HAND WRITTEN)", "C E-NOTES"], link: "https://t.me/your_C_language_channel" },
                { id: "cpp_notes", name: "C++ Language Notes", price: 900, details: ["C++ NOTES (HAND WRITTEN)", "C++ E-NOTES"], link: "https://t.me/+YZAEiLCzEDkwNjdl" },
                { id: "java_notes", name: "JAVA Language Notes", price: 900, details: ["JAVA NOTES (HAND WRITTEN)", "JAVA E-NOTES"], link: "https://t.me/your_JAVA_language_channel" },
                { id: "python_notes", name: "Python Language Notes", price: 900, details: ["PYTHON NOTES (HAND WRITTEN)", "PYTHON E-NOTES"], link: "https://t.me/your_PYTHON_language_channel" },
                { id: "sql_notes", name: "SQL Language Notes", price: 900, details: ["SQL NOTES (HAND WRITTEN)", "SQL E-NOTES"], link: "https://t.me/your_SQL_language_channel" },
                { id: "dsa_analytics", name: "DSA + Data Analytics Plan", price: 15900, details: ["ROADMAP", "DSA NOTES", "COMPANY CHEAT SHEET"], link: "https://t.me/your_DSA_Analytics_channel" },
                { id: "dsa_fullstack", name: "DSA + Full-Stack Plan", price: 14900, details: ["ROADMAP", "DSA NOTES", "COMPANY CHEAT SHEET"], link: "https://t.me/your_DSA_FullStack_channel" }
            ];
    
            const validCoupon = { code: "SAVE1", discount: 800 }; // 800 paisa = ₹8 discount
            const ownerCoupon = "FREE"; // Hidden coupon for owner only (not displayed anywhere)
    
            // =================================================================
            // STEP 2: DYNAMICALLY CREATE PRODUCT CARDS
            // =================================================================
    
            const plansGrid = document.querySelector('.units-grid');
            if (plansGrid) {
                plansGrid.innerHTML = ''; // Clear any static HTML
                products.forEach(product => {
                    const card = document.createElement('div');
                    card.className = 'unit-card';
                    card.setAttribute('data-product-id', product.id);
    
                    const detailsHtml = product.details.map(detail => `<li><i class="fas fa-play-circle"></i> ${detail}</li>`).join('');
                    
                    card.innerHTML = `
                        <div class="unit-header"><h3>${product.name}</h3></div>
                        <div class="unit-content">
                            <ul>
                                ${detailsHtml}
                                <li class="coupon-wrapper"><input type="text" placeholder="Enter Coupon" class="coupon-input"></li>
                                <li><button class="btn buy-btn">Buy for ₹${product.price / 100}</button></li>
                            </ul>
                        </div>
                    `;
                    plansGrid.appendChild(card);
                });
            }
    
            // =================================================================
            // STEP 3: PAYMENT PROCESSING LOGIC FOR PRODUCTS
            // =================================================================
            
            document.querySelectorAll('.buy-btn').forEach(button => {
                button.addEventListener('click', (e) => {
                    const clickedButton = e.currentTarget;
                    const unitCard = clickedButton.closest('.unit-card');
                    const productId = unitCard.getAttribute('data-product-id');
                    const product = products.find(p => p.id === productId);
    
                    if (!product) {
                        alert("Error: Product not found.");
                        return;
                    }
    
                    const couponInput = unitCard.querySelector('.coupon-input');
                    const originalButtonText = clickedButton.innerHTML;
                    
                    clickedButton.innerHTML = 'Processing...';
                    clickedButton.disabled = true;
    
                    let finalAmount = product.price;
                    let planName = product.name;
                    const couponCode = couponInput ? couponInput.value.trim().toUpperCase() : '';
    
                    // Coupon Validation
                    if (couponCode) {
                        if (couponCode === validCoupon.code) {
                            finalAmount = product.price - validCoupon.discount;
                            if (finalAmount < 100) finalAmount = 100; // Ensure min price of ₹1
                            planName += ` (Saved ₹${validCoupon.discount / 100})`;
                        } else if (couponCode === ownerCoupon) {
                            // Owner coupon - free download
                            finalAmount = 100; // Minimum amount for Razorpay is ₹1
                            planName += ` (FREE Download)`;
                        } else {
                            alert('Invalid coupon code.');
                            clickedButton.innerHTML = originalButtonText;
                            clickedButton.disabled = false;
                            return;
                        }
                    }
    
                    // Razorpay Options
                    const options = {
                        key: RAZORPAY_KEY_ID,
                        amount: finalAmount,
                        currency: "INR",
                        name: "TWSS",
                        description: `Purchase of ${planName}`,
                        notes: {
                            // This 'notes' object is for your reference in the Razorpay dashboard
                            productId: product.id,
                            productName: product.name
                        },
                        handler: function (response) {
                            // ✅ FIX: Directly use the 'product.link' which is already available here.
                            // Do not rely on 'response.notes' to get the link on the client-side.
                            const finalRedirectUrl = product.link;
    
                            if (finalRedirectUrl && unitCard) {
                                // Update the card's HTML to show success message and access button
                                unitCard.innerHTML = `
                                    <div class="unit-header"><h3>Payment Successful!</h3></div>
                                    <div class="unit-content" style="text-align: center; display: flex; flex-direction: column; justify-content: center; align-items: center;">
                                        <p style="margin-bottom: 1.5rem;">Click the button below to access your content. ✅</p>
                                        <a href="${finalRedirectUrl}" class="btn btn-success" target="_blank">Go to Your Channel</a>
                                    </div>
                                `;
                            } else {
                                // This is a fallback, in case something goes wrong
                                alert('Payment Successful, but the redirect link is missing. Please contact support.');
                            }
                        },
                        modal: {
                            ondismiss: () => {
                                // Restore the button if the user closes the payment pop-up
                                clickedButton.innerHTML = originalButtonText;
                                clickedButton.disabled = false;
                            }
                        },
                        prefill: { name: "", email: "", contact: "" },
                        theme: { color: "#CD5C5C" }
                    };
    
                    const rzp = new Razorpay(options);
                    rzp.on('payment.failed', (response) => {
                        clickedButton.innerHTML = originalButtonText;
                        clickedButton.disabled = false;
                        alert(`Payment failed: ${response.error.description}`);
                    });
    
                    rzp.open();
                });
            });
            
            // =================================================================
            // STEP 4: DOWNLOAD SECTION LOGIC
            // =================================================================
            
            document.querySelectorAll('.download-btn').forEach(button => {
                button.addEventListener('click', (e) => {
                    const card = e.currentTarget.closest('.download-card');
                    const day = card.getAttribute('data-day');
                    
                    // Today button is disabled, so we don't need to handle it here
                    if (day === 'today') {
                        return;
                    }
                    
                    const originalButtonText = e.currentTarget.innerHTML;
                    e.currentTarget.innerHTML = 'Processing...';
                    e.currentTarget.disabled = true;
                    
                    let amount = 4900; // 49 Rs in paisa
                    let dayName = '';
                    
                    // Set day name based on the data-day attribute
                    if (day === 'yesterday') {
                        dayName = 'Yesterday';
                    } else if (day === 'daybeforeyesterday') {
                        dayName = 'Day Before Yesterday';
                    } else if (day === 'daybeforebeforeyesterday') {
                        dayName = 'Day Before Before Yesterday';
                    }
                    
                    // Check for owner coupon
                    const couponInput = card.querySelector('.coupon-input');
                    const couponCode = couponInput ? couponInput.value.trim().toUpperCase() : '';
                    
                    if (couponCode === ownerCoupon) {
                        // Owner coupon - free download
                        amount = 100; // Minimum amount for Razorpay is ₹1
                    }
                    
                    const options = {
                        key: RAZORPAY_KEY_ID,
                        amount: amount,
                        currency: "INR",
                        name: "TWSS",
                        description: `Download for ${dayName}`,
                        notes: {
                            day: day
                        },
                        handler: function (response) {
                            let redirectUrl = '';
                            
                            // Set redirect URL based on the day
                            if (day === 'yesterday') {
                                redirectUrl = 'https://twss.netlify.app/yesterdaydl.html';
                            } else if (day === 'daybeforeyesterday') {
                                redirectUrl = 'https://twss.netlify.app/daybeforeyesterday.html';
                            } else if (day === 'daybeforebeforeyesterday') {
                                redirectUrl = 'https://twss.netlify.app/daybeforebeforeyesterday.html';
                            }
                            
                            if (redirectUrl) {
                                // Redirect to the appropriate page
                                window.location.href = redirectUrl;
                            } else {
                                alert('Payment successful but redirect URL not found. Please contact support.');
                                e.currentTarget.innerHTML = originalButtonText;
                                e.currentTarget.disabled = false;
                            }
                        },
                        modal: {
                            ondismiss: () => {
                                // Restore the button if the user closes the payment pop-up
                                e.currentTarget.innerHTML = originalButtonText;
                                e.currentTarget.disabled = false;
                            }
                        },
                        prefill: { name: "", email: "", contact: "" },
                        theme: { color: "#CD5C5C" }
                    };
                    
                    const rzp = new Razorpay(options);
                    rzp.on('payment.failed', (response) => {
                        e.currentTarget.innerHTML = originalButtonText;
                        e.currentTarget.disabled = false;
                        alert(`Payment failed: ${response.error.description}`);
                    });
                    
                    rzp.open();
                });
            });
        });
    </script>

     <script>
        // Remove alert calls for better user experience
        document.onkeydown = function(e) {
            if (
                e.ctrlKey && (e.key === 'u' || e.key === 'U' || e.key === 's' || e.key === 'S') ||
                e.key === 'F12' ||
                (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i'))
            ) {
                // console.log("Developer tools or source view attempt detected.");
                return false; // Prevent default action for these keys
            }
        };
        
        document.addEventListener('contextmenu', event => {
            event.preventDefault(); // Prevent right-click context menu
        });
            </script>
