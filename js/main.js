class TypeWriter {
    constructor(txtElement, words, wait = 3000) {
        this.txtElement = txtElement;
        this.words = words;
        this.txt = '';
        this.wordIndex = 0;
        this.wait = parseInt(wait, 10);
        this.type();
        this.isDeleting = false;
    }

    type() {
        const current = this.wordIndex % this.words.length;
        const fullTxt = this.words[current];

        if (this.isDeleting) {
            this.txt = fullTxt.substring(0, this.txt.length - 1);
        } else {
            this.txt = fullTxt.substring(0, this.txt.length + 1);
        }

        this.txtElement.innerHTML = `<span class="txt">${this.txt}</span>`;

        let typeSpeed = 80;

        if (this.isDeleting) {
            typeSpeed /= 2;
        }

        if (!this.isDeleting && this.txt === fullTxt) {
            typeSpeed = this.wait;
            this.isDeleting = true;
        } else if (this.isDeleting && this.txt === '') {
            this.isDeleting = false;
            this.wordIndex++;
            typeSpeed = 500;
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    init();
    initPurchaseModal();
});

function init() {
    const txtElement = document.querySelector('.typewriter');
    if (txtElement) {
        const words = JSON.parse(txtElement.getAttribute('data-words'));
        const wait = txtElement.getAttribute('data-wait');
        new TypeWriter(txtElement, words, wait);
    }
}

function initPurchaseModal() {
    const buyButtons = document.querySelectorAll('.btn-buy-template');
    const modal = document.getElementById('purchaseModal');
    if (!modal) return;
    
    const modalTemplateName = document.getElementById('modalTemplateName');
    const modalTemplatePrice = document.getElementById('modalTemplatePrice');
    const stkPrice = document.getElementById('stkPrice');

    const formContainer = document.getElementById('purchaseFormContainer');
    const stkLoading = document.getElementById('stkLoading');
    const stkSim = document.getElementById('stkSim');
    const stkSuccess = document.getElementById('stkSuccess');

    const purchaseForm = document.getElementById('purchaseForm');
    const mpesaPhone = document.getElementById('mpesaPhone');
    const stkPinInput = document.getElementById('stkPin');

    buyButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const name = btn.getAttribute('data-name');
            const price = btn.getAttribute('data-price');
            
            modalTemplateName.innerText = name;
            modalTemplatePrice.innerText = price;
            stkPrice.innerText = price;
            
            // Reset modal state
            formContainer.style.display = 'block';
            stkLoading.style.display = 'none';
            stkSim.style.display = 'none';
            stkSuccess.style.display = 'none';
            mpesaPhone.value = '';
            stkPinInput.value = '';
            
            modal.classList.add('show');
        });
    });

    window.closePurchaseModal = () => {
        modal.classList.remove('show');
    };

    window.cancelStk = () => {
        formContainer.style.display = 'block';
        stkLoading.style.display = 'none';
        stkSim.style.display = 'none';
    };

    purchaseForm.addEventListener('submit', (e) => {
        e.preventDefault();
        formContainer.style.display = 'none';
        stkLoading.style.display = 'block';
        stkLoading.querySelector('p').innerText = "Sending STK Push to your phone...";
        
        // Simulate STK Push delay
        setTimeout(() => {
            stkLoading.style.display = 'none';
            stkSim.style.display = 'block';
            stkPinInput.focus();
        }, 1800);
    });

    // Submit PIN logic
    window.submitPin = () => {
        const pin = stkPinInput.value;
        if (pin.length === 4) {
            stkSim.style.display = 'none';
            stkLoading.style.display = 'block';
            stkLoading.querySelector('p').innerText = "Processing M-Pesa Payment...";
            
            setTimeout(() => {
                stkLoading.style.display = 'none';
                stkSuccess.style.display = 'block';
                console.log("Mock download triggered for template package");
            }, 1500);
        } else {
            alert("Please enter a valid 4-digit PIN");
        }
    };

    // Auto submit PIN when 4 characters are entered
    stkPinInput.addEventListener('input', () => {
        if (stkPinInput.value.length === 4) {
            submitPin();
        }
    });
}
