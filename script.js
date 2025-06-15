 function calculateEMI() {
            // Get input values
            const loanAmount = parseFloat(document.getElementById('loanAmount').value);
            const annualRate = parseFloat(document.getElementById('interestRate').value);
            const tenure = parseFloat(document.getElementById('loanTenure').value);
            const tenureType = document.getElementById('tenureType').value;

            // Validation
            if (!loanAmount || !annualRate || !tenure) {
                alert('Please fill in all fields');
                return;
            }

            if (loanAmount < 1000) {
                alert('Loan amount should be at least ₹1,000');
                return;
            }

            if (annualRate <= 0 || annualRate > 50) {
                alert('Interest rate should be between 0.1% and 50%');
                return;
            }

            if (tenure <= 0) {
                alert('Tenure should be greater than 0');
                return;
            }

            // Show loading
            document.getElementById('loading').style.display = 'block';
            document.querySelector('.calculate-btn').style.display = 'none';

            // Simulate calculation delay for better UX
            setTimeout(() => {
                // Convert tenure to months
                const tenureInMonths = tenureType === 'years' ? tenure * 12 : tenure;

                // Calculate monthly interest rate
                const monthlyRate = annualRate / (12 * 100);

                // Calculate EMI using formula: P * r * (1+r)^n / ((1+r)^n - 1)
                const emi = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenureInMonths)) / 
                           (Math.pow(1 + monthlyRate, tenureInMonths) - 1);

                const totalAmount = emi * tenureInMonths;
                const totalInterest = totalAmount - loanAmount;

                // Update results with animation
                animateValue('monthlyEMI', 0, emi, 1000, '₹');
                animateValue('totalInterest', 0, totalInterest, 1200, '₹');
                animateValue('totalAmount', 0, totalAmount, 1400, '₹');

                // Update breakdown
                document.getElementById('principalAmount').textContent = '₹' + formatNumber(loanAmount);
                document.getElementById('interestComponent').textContent = '₹' + formatNumber(totalInterest);
                document.getElementById('displayRate').textContent = annualRate + '%';
                document.getElementById('displayTenure').textContent = 
                    tenureType === 'years' ? tenure + ' Years' : tenure + ' Months';

                // Hide loading and show button
                document.getElementById('loading').style.display = 'none';
                document.querySelector('.calculate-btn').style.display = 'block';
            }, 1000);
        }

        function animateValue(elementId, start, end, duration, prefix = '') {
            const element = document.getElementById(elementId);
            const startTime = performance.now();

            function update(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                const current = start + (end - start) * easeOutCubic(progress);
                element.textContent = prefix + formatNumber(Math.round(current));

                if (progress < 1) {
                    requestAnimationFrame(update);
                }
            }

            requestAnimationFrame(update);
        }

        function easeOutCubic(t) {
            return 1 - Math.pow(1 - t, 3);
        }

        function formatNumber(num) {
            return num.toLocaleString('en-IN');
        }

        // Add input event listeners for real-time validation
        document.getElementById('loanAmount').addEventListener('input', function() {
            if (this.value < 0) this.value = 0;
        });

        document.getElementById('interestRate').addEventListener('input', function() {
            if (this.value < 0) this.value = 0;
            if (this.value > 50) this.value = 50;
        });

        document.getElementById('loanTenure').addEventListener('input', function() {
            if (this.value < 0) this.value = 0;
        });

        // Allow Enter key to calculate
        document.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                calculateEMI();
            }
        });