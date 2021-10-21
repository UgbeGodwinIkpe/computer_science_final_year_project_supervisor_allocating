// Flutterwave payment gateway
const form = document.getElementById("projectForm");
if (form != null) {
    form.addEventListener("submit", payNow);
}

function payNow(e) {
    console.log('I can reach here...');
    // prevent default form submition
    e.preventDefault();

    // set configurations
    FlutterwaveCheckout({
        public_key: "FLWPUBK-ea911ad04be9e1019db650231994ec1c-X",
        tx_ref: "TRF_" + Math.floor((Math.random() * 1000000000) + 1),
        amount: 1500,
        currency: "NGN",
        customer: {
            email: document.getElementById("email").value,
            phone_number: document.getElementById("phoneNumber").value,
            name: document.getElementById("firstName").value
        },
        callback: function(data) {
            console.log(data);
            const reference = data.tx_ref;
            const transaction_id = data.transaction_id;
            alert("Payment was successfully completed, your REG. Number is: " + reference + ". And your transaction Id is: " + transaction_id + ". A receiptfor your payment has been sent to your email.");
            $post('/registerprojecttopics');
            window.location.replace("http://localhost:7070/paidPIN");
        },
        customizations: {
            'title': "C.Sc Final Year Project",
            'description': "Submission of Project Topics for Approval",
            'logo': "public/images/CidusfaceLogo.png"
        }
    });
}