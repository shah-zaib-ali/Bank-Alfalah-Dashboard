// Bank Alfalah Dashboard JavaScript

// Global variables
let dashboardData = null;
let charts = {};

// Load JSON data
async function loadData() {
    try {
        const response = await fetch('bank_dashboard_data.json');
        dashboardData = await response.json();
        console.log('Data loaded successfully');
        initializeDashboard();
    } catch (error) {
        console.error('Error loading data:', error);
        alert('Failed to load dashboard data. Please check the console for details.');
    }
}

// Initialize the dashboard
function initializeDashboard() {
    // Set current date and time
    updateDateTime();
    setInterval(updateDateTime, 60000);
    
    // Initialize all dashboard sections
    initializeOverview();
    initializeDemographics();
    initializeAccounts();
    initializeTransactions();
    initializeGeographical();
    initializeRiskAnalysis();
    initializeSegments();
    
    // Show loading is complete
    console.log('Dashboard initialized');
}

// Update date and time display
function updateDateTime() {
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    document.getElementById('current-date-time').textContent = now.toLocaleDateString('en-US', options);
}

// Format currency values
function formatCurrency(value) {
    return new Intl.NumberFormat('en-PK', {
        style: 'currency',
        currency: 'PKR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value);
}

// Navigation handling
document.addEventListener('DOMContentLoaded', function() {
    // Load data when DOM is ready
    loadData();
    
    // Set up navigation
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            navItems.forEach(navItem => navItem.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Hide all sections
            document.querySelectorAll('section').forEach(section => {
                section.classList.remove('active-section');
            });
            
            // Show the selected section
            const sectionId = this.getAttribute('data-section');
            document.getElementById(sectionId).classList.add('active-section');
        });
    });
});

// Initialize Overview Section
function initializeOverview() {
    if (!dashboardData) return;
    
    // Set basic metrics
    document.getElementById('total-customers').textContent = Object.keys(dashboardData.raw_data).length;
    document.getElementById('avg-balance').textContent = formatCurrency(dashboardData.account_info.avg_balance);
    document.getElementById('avg-credit-score').textContent = Math.round(dashboardData.risk_data.avg_credit_score);
    
    // Calculate loan percentage
    const loanYes = dashboardData.loan_data.loan_status.Yes || 0;
    const loanNo = dashboardData.loan_data.loan_status.No || 0;
    const loanPercentage = (loanYes / (loanYes + loanNo) * 100).toFixed(1);
    document.getElementById('loan-percentage').textContent = `${loanPercentage}%`;
    
    // Account Type Chart
    const accountTypeData = dashboardData.account_info.account_types;
    const accountTypeChart = new Chart(
        document.getElementById('account-type-chart'),
        {
            type: 'doughnut',
            data: {
                labels: Object.keys(accountTypeData),
                datasets: [{
                    data: Object.values(accountTypeData),
                    backgroundColor: [
                        'rgba(0, 104, 62, 0.8)',
                        'rgba(8, 138, 67, 0.8)',
                        'rgba(255, 184, 28, 0.8)',
                        'rgba(45, 156, 219, 0.8)',
                        'rgba(156, 39, 176, 0.8)'
                    ],
                    borderColor: 'white',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                    },
                    title: {
                        display: false
                    }
                }
            }
        }
    );
    charts.accountType = accountTypeChart;
    
    // Risk Distribution Chart
    const riskData = dashboardData.risk_data.risk_distribution;
    const riskChart = new Chart(
        document.getElementById('risk-distribution-chart'),
        {
            type: 'doughnut',
            data: {
                labels: Object.keys(riskData),
                datasets: [{
                    data: Object.values(riskData),
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.8)',
                        'rgba(255, 159, 64, 0.8)',
                        'rgba(255, 205, 86, 0.8)',
                        'rgba(75, 192, 192, 0.8)'
                    ],
                    borderColor: 'white',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                    }
                }
            }
        }
    );
    charts.riskDistribution = riskChart;
    
    // Balance by Account Type Chart
    const balanceByAccountType = dashboardData.account_info.balance_by_account_type;
    const balanceChart = new Chart(
        document.getElementById('balance-by-account-chart'),
        {
            type: 'bar',
            data: {
                labels: Object.keys(balanceByAccountType),
                datasets: [{
                    label: 'Average Balance (PKR)',
                    data: Object.values(balanceByAccountType),
                    backgroundColor: 'rgba(0, 104, 62, 0.7)',
                    borderColor: 'rgba(0, 104, 62, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return formatCurrency(value);
                            }
                        }
                    }
                }
            }
        }
    );
    charts.balanceByAccount = balanceChart;
}

// Initialize Demographics Section
function initializeDemographics() {
    if (!dashboardData) return;
    
    // Gender Distribution Chart
    const genderData = dashboardData.customer_demographics.gender_distribution;
    const genderChart = new Chart(
        document.getElementById('gender-chart'),
        {
            type: 'pie',
            data: {
                labels: Object.keys(genderData),
                datasets: [{
                    data: Object.values(genderData),
                    backgroundColor: [
                        'rgba(54, 162, 235, 0.8)',
                        'rgba(255, 99, 132, 0.8)'
                    ],
                    borderColor: 'white',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                    }
                }
            }
        }
    );
    charts.gender = genderChart;
    
    // Marital Status Chart
    const maritalData = dashboardData.customer_demographics.marital_status;
    const maritalChart = new Chart(
        document.getElementById('marital-status-chart'),
        {
            type: 'pie',
            data: {
                labels: Object.keys(maritalData),
                datasets: [{
                    data: Object.values(maritalData),
                    backgroundColor: [
                        'rgba(255, 159, 64, 0.8)',
                        'rgba(75, 192, 192, 0.8)',
                        'rgba(153, 102, 255, 0.8)',
                        'rgba(201, 203, 207, 0.8)'
                    ],
                    borderColor: 'white',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                    }
                }
            }
        }
    );
    charts.marital = maritalChart;
    
    // Age Distribution Chart
    const ageData = dashboardData.customer_demographics.age_distribution;
    // Group ages into ranges
    const ageRanges = {
        '18-30': 0,
        '31-40': 0,
        '41-50': 0,
        '51-60': 0,
        '61+': 0
    };
    
    Object.entries(ageData).forEach(([age, count]) => {
        age = parseInt(age);
        if (age <= 30) ageRanges['18-30'] += count;
        else if (age <= 40) ageRanges['31-40'] += count;
        else if (age <= 50) ageRanges['41-50'] += count;
        else if (age <= 60) ageRanges['51-60'] += count;
        else ageRanges['61+'] += count;
    });
    
    const ageChart = new Chart(
        document.getElementById('age-distribution-chart'),
        {
            type: 'bar',
            data: {
                labels: Object.keys(ageRanges),
                datasets: [{
                    label: 'Number of Customers',
                    data: Object.values(ageRanges),
                    backgroundColor: 'rgba(0, 104, 62, 0.7)',
                    borderColor: 'rgba(0, 104, 62, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        }
    );
    charts.ageDistribution = ageChart;
    
    // Education Level Chart
    const educationData = dashboardData.customer_demographics.education_distribution;
    const educationChart = new Chart(
        document.getElementById('education-chart'),
        {
            type: 'bar',
            data: {
                labels: Object.keys(educationData),
                datasets: [{
                    label: 'Number of Customers',
                    data: Object.values(educationData),
                    backgroundColor: 'rgba(255, 184, 28, 0.7)',
                    borderColor: 'rgba(255, 184, 28, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        }
    );
    charts.education = educationChart;
    
    // Employment Status Chart
    const employmentData = dashboardData.customer_demographics.employment_status;
    const employmentChart = new Chart(
        document.getElementById('employment-chart'),
        {
            type: 'bar',
            data: {
                labels: Object.keys(employmentData),
                datasets: [{
                    label: 'Number of Customers',
                    data: Object.values(employmentData),
                    backgroundColor: 'rgba(8, 138, 67, 0.7)',
                    borderColor: 'rgba(8, 138, 67, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        }
    );
    charts.employment = employmentChart;
}

// Initialize Accounts Section
function initializeAccounts() {
    if (!dashboardData) return;
    
    // Account Balance Distribution Chart (using ApexCharts)
    const balanceRanges = {
        '0-50k': 0,
        '50k-100k': 0,
        '100k-500k': 0,
        '500k-1M': 0,
        '1M+': 0
    };
    
    // Calculate balance distribution from raw data
    dashboardData.raw_data.forEach(customer => {
        const balance = customer.Balance;
        if (balance <= 50000) balanceRanges['0-50k']++;
        else if (balance <= 100000) balanceRanges['50k-100k']++;
        else if (balance <= 500000) balanceRanges['100k-500k']++;
        else if (balance <= 1000000) balanceRanges['500k-1M']++;
        else balanceRanges['1M+']++;
    });
    
    const balanceDistOptions = {
        series: [{
            name: 'Number of Customers',
            data: Object.values(balanceRanges)
        }],
        chart: {
            type: 'area',
            height: 350,
            zoom: {
                enabled: false
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'smooth',
            width: 2,
        },
        colors: ['#00683E'],
        title: {
            text: 'Account Balance Distribution',
            align: 'left'
        },
        grid: {
            row: {
                colors: ['#f3f3f3', 'transparent'],
                opacity: 0.5
            },
        },
        xaxis: {
            categories: Object.keys(balanceRanges),
        },
        yaxis: {
            title: {
                text: 'Number of Customers'
            },
        },
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.7,
                opacityTo: 0.9,
                stops: [0, 90, 100]
            }
        }
    };
    
    const balanceDistChart = new ApexCharts(document.getElementById('balance-distribution-chart'), balanceDistOptions);
    balanceDistChart.render();
    
    // Account Types Chart (duplicate from overview for this section)
    const accountTypeData = dashboardData.account_info.account_types;
    const accountTypesChart = new Chart(
        document.getElementById('account-types-chart'),
        {
            type: 'pie',
            data: {
                labels: Object.keys(accountTypeData),
                datasets: [{
                    data: Object.values(accountTypeData),
                    backgroundColor: [
                        'rgba(0, 104, 62, 0.8)',
                        'rgba(8, 138, 67, 0.8)',
                        'rgba(255, 184, 28, 0.8)',
                        'rgba(45, 156, 219, 0.8)',
                        'rgba(156, 39, 176, 0.8)'
                    ],
                    borderColor: 'white',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                    }
                }
            }
        }
    );
    charts.accountTypes = accountTypesChart;
    
    // Credit Card Status Chart (Using data from raw data)
    const creditCardStatus = { 'Yes': 0, 'No': 0 };
    dashboardData.raw_data.forEach(customer => {
        creditCardStatus[customer.HasCreditCard]++;
    });
    
    const creditCardChart = new Chart(
        document.getElementById('credit-card-chart'),
        {
            type: 'pie',
            data: {
                labels: Object.keys(creditCardStatus),
                datasets: [{
                    data: Object.values(creditCardStatus),
                    backgroundColor: [
                        'rgba(54, 162, 235, 0.8)',
                        'rgba(255, 99, 132, 0.8)'
                    ],
                    borderColor: 'white',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                    }
                }
            }
        }
    );
    charts.creditCard = creditCardChart;
    
    // Balance by Demographics Chart
    const balanceByEducation = {};
    Object.keys(dashboardData.customer_demographics.education_distribution).forEach(edu => {
        balanceByEducation[edu] = 0;
    });
    
    let educationCounts = {};
    dashboardData.raw_data.forEach(customer => {
        const edu = customer.EducationLevel;
        if (!balanceByEducation[edu]) balanceByEducation[edu] = 0;
        if (!educationCounts[edu]) educationCounts[edu] = 0;
        
        balanceByEducation[edu] += customer.Balance;
        educationCounts[edu]++;
    });
    
    // Calculate average balance per education level
    Object.keys(balanceByEducation).forEach(edu => {
        if (educationCounts[edu]) {
            balanceByEducation[edu] = balanceByEducation[edu] / educationCounts[edu];
        }
    });
    
    const balanceByDemoChart = new Chart(
        document.getElementById('balance-by-demographics-chart'),
        {
            type: 'bar',
            data: {
                labels: Object.keys(balanceByEducation),
                datasets: [{
                    label: 'Average Balance by Education Level',
                    data: Object.values(balanceByEducation),
                    backgroundColor: 'rgba(255, 184, 28, 0.7)',
                    borderColor: 'rgba(255, 184, 28, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return formatCurrency(value);
                            }
                        }
                    }
                }
            }
        }
    );
    charts.balanceByDemo = balanceByDemoChart;
}

// Initialize Transactions Section
function initializeTransactions() {
    if (!dashboardData || !dashboardData.transaction_data) return;
    
    // Make sure we have all the required properties
    const transactionData = dashboardData.transaction_data;
    
    // Set average transactions if the property exists
    if (transactionData.avg_transactions !== undefined) {
        document.getElementById('avg-transactions').textContent = 
            transactionData.avg_transactions.toFixed(1);
    } else {
        document.getElementById('avg-transactions').textContent = "N/A";
    }
    
    // Transaction Frequency Chart
    const transactionFreq = {
        '0-5': 0,
        '6-10': 0,
        '11-15': 0,
        '16-20': 0,
        '21+': 0
    };
    
    // Only process if raw_data exists
    if (dashboardData.raw_data && Array.isArray(dashboardData.raw_data)) {
        dashboardData.raw_data.forEach(customer => {
            if (customer && customer.NumTransactions30Days !== undefined) {
                const txCount = customer.NumTransactions30Days;
                if (txCount <= 5) transactionFreq['0-5']++;
                else if (txCount <= 10) transactionFreq['6-10']++;
                else if (txCount <= 15) transactionFreq['11-15']++;
                else if (txCount <= 20) transactionFreq['16-20']++;
                else transactionFreq['21+']++;
            }
        });
    }
    
    const transactionFreqChart = new Chart(
        document.getElementById('transaction-frequency-chart'),
        {
            type: 'pie',
            data: {
                labels: Object.keys(transactionFreq),
                datasets: [{
                    data: Object.values(transactionFreq),
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.7)',
                        'rgba(255, 159, 64, 0.7)',
                        'rgba(255, 205, 86, 0.7)',
                        'rgba(75, 192, 192, 0.7)',
                        'rgba(54, 162, 235, 0.7)'
                    ],
                    borderColor: 'white',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                    }
                }
            }
        }
    );
    charts.transactionFreq = transactionFreqChart;
    
    // Transactions by Account Type Chart
    const txByAccount = transactionData.transactions_by_account_type || {};
    const txByAccountChart = new Chart(
        document.getElementById('transactions-by-account-chart'),
        {
            type: 'bar',
            data: {
                labels: Object.keys(txByAccount),
                datasets: [{
                    label: 'Average Transactions per Month',
                    data: Object.values(txByAccount),
                    backgroundColor: 'rgba(0, 104, 62, 0.7)',
                    borderColor: 'rgba(0, 104, 62, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        }
    );
    charts.txByAccount = txByAccountChart;
    
    // Transactions by Age Group Chart
    const txByAge = transactionData.transactions_by_age_group || {};
    // Convert the dictionary keys to readable format
    const ageLabels = Object.keys(txByAge).map(key => {
        return key.replace('(', '').replace(']', '').replace(',', '-');
    });
    
    const txByAgeChart = new Chart(
        document.getElementById('transactions-by-age-chart'),
        {
            type: 'line',
            data: {
                labels: ageLabels,
                datasets: [{
                    label: 'Average Transactions per Month',
                    data: Object.values(txByAge),
                    backgroundColor: 'rgba(255, 184, 28, 0.7)',
                    borderColor: 'rgba(255, 184, 28, 1)',
                    borderWidth: 2,
                    tension: 0.3,
                    fill: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        }
    );
    charts.txByAge = txByAgeChart;
}

// Initialize Geographical Section
function initializeGeographical() {
    if (!dashboardData) return;
    
    // Customer Distribution by City
    const cityData = dashboardData.geographical_data.customer_by_city;
    const cityDistChart = new Chart(
        document.getElementById('city-distribution-chart'),
        {
            type: 'bar',
            data: {
                labels: Object.keys(cityData),
                datasets: [{
                    label: 'Number of Customers',
                    data: Object.values(cityData),
                    backgroundColor: 'rgba(0, 104, 62, 0.7)',
                    borderColor: 'rgba(0, 104, 62, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        }
    );
    charts.cityDist = cityDistChart;
    
    // Average Balance by City
    const balanceByCityData = dashboardData.geographical_data.avg_balance_by_city;
    const balanceByCityChart = new Chart(
        document.getElementById('balance-by-city-chart'),
        {
            type: 'bar',
            data: {
                labels: Object.keys(balanceByCityData),
                datasets: [{
                    label: 'Average Balance (PKR)',
                    data: Object.values(balanceByCityData),
                    backgroundColor: 'rgba(255, 184, 28, 0.7)',
                    borderColor: 'rgba(255, 184, 28, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return formatCurrency(value);
                            }
                        }
                    }
                }
            }
        }
    );
    charts.balanceByCity = balanceByCityChart;
    
    // Account Types by Top Cities
    const accountByCityData = dashboardData.geographical_data.account_types_by_city;
    // Get top 5 cities by customer count
    const topCities = Object.entries(cityData)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(entry => entry[0]);
    
    // Prepare datasets for each account type
    const accountTypes = Object.keys(dashboardData.account_info.account_types);
    const accountByCityDatasets = accountTypes.map((type, index) => {
        const cityData = topCities.map(city => {
            return (accountByCityData[city] && accountByCityData[city][type]) || 0;
        });
        
        const colors = [
            'rgba(0, 104, 62, 0.7)',
            'rgba(8, 138, 67, 0.7)',
            'rgba(255, 184, 28, 0.7)',
            'rgba(45, 156, 219, 0.7)',
            'rgba(156, 39, 176, 0.7)'
        ];
        
        return {
            label: type,
            data: cityData,
            backgroundColor: colors[index % colors.length],
            borderColor: colors[index % colors.length].replace('0.7', '1'),
            borderWidth: 1
        };
    });
    
    const accountByCityChart = new Chart(
        document.getElementById('account-by-city-chart'),
        {
            type: 'bar',
            data: {
                labels: topCities,
                datasets: accountByCityDatasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        stacked: true
                    },
                    y: {
                        stacked: true,
                        beginAtZero: true
                    }
                }
            }
        }
    );
    charts.accountByCity = accountByCityChart;
}

// Initialize Risk Analysis Section
function initializeRiskAnalysis() {
    if (!dashboardData) return;
    
    // Risk Distribution Chart
    const riskData = dashboardData.risk_data.risk_distribution;
    const riskDistChart = new Chart(
        document.getElementById('risk-dist-chart'),
        {
            type: 'pie',
            data: {
                labels: Object.keys(riskData),
                datasets: [{
                    data: Object.values(riskData),
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.8)',
                        'rgba(255, 159, 64, 0.8)',
                        'rgba(255, 205, 86, 0.8)',
                        'rgba(75, 192, 192, 0.8)'
                    ],
                    borderColor: 'white',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                    }
                }
            }
        }
    );
    charts.riskDist = riskDistChart;
    
    // Loan Types Chart
    const loanTypeData = dashboardData.loan_data.loan_types;
    const loanTypesChart = new Chart(
        document.getElementById('loan-types-chart'),
        {
            type: 'pie',
            data: {
                labels: Object.keys(loanTypeData).filter(type => type !== 'None'),
                datasets: [{
                    data: Object.entries(loanTypeData)
                        .filter(([type]) => type !== 'None')
                        .map(([_, count]) => count),
                    backgroundColor: [
                        'rgba(54, 162, 235, 0.8)',
                        'rgba(255, 206, 86, 0.8)',
                        'rgba(75, 192, 192, 0.8)',
                        'rgba(153, 102, 255, 0.8)',
                        'rgba(255, 159, 64, 0.8)'
                    ],
                    borderColor: 'white',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                    }
                }
            }
        }
    );
    charts.loanTypes = loanTypesChart;
    
    // Risk by Account Type
    const riskByAccountData = dashboardData.risk_data.risk_by_account_type;
    const accountTypes = Object.keys(riskByAccountData);
    
    // Prepare datasets
    const riskCategories = ['High Risk', 'Medium Risk', 'Low Risk', 'Very Low Risk'];
    const datasets = riskCategories.map((category, index) => {
        const colors = [
            'rgba(255, 99, 132, 0.7)',
            'rgba(255, 159, 64, 0.7)',
            'rgba(255, 205, 86, 0.7)',
            'rgba(75, 192, 192, 0.7)'
        ];
        
        return {
            label: category,
            data: accountTypes.map(type => {
                return (riskByAccountData[type] && riskByAccountData[type][category]) || 0;
            }),
            backgroundColor: colors[index],
            borderColor: colors[index].replace('0.7', '1'),
            borderWidth: 1
        };
    });
    
    const riskByAccountChart = new Chart(
        document.getElementById('risk-by-account-chart'),
        {
            type: 'bar',
            data: {
                labels: accountTypes,
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        stacked: true
                    },
                    y: {
                        stacked: true,
                        beginAtZero: true
                    }
                }
            }
        }
    );
    charts.riskByAccount = riskByAccountChart;
    
    // Loans by Employment Status
    const loanByEmployment = dashboardData.loan_data.loan_by_employment;
    const loanByEmploymentChart = new Chart(
        document.getElementById('loans-by-employment-chart'),
        {
            type: 'bar',
            data: {
                labels: Object.keys(loanByEmployment),
                datasets: [{
                    label: 'Number of Customers with Loans',
                    data: Object.values(loanByEmployment),
                    backgroundColor: 'rgba(0, 104, 62, 0.7)',
                    borderColor: 'rgba(0, 104, 62, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        }
    );
    charts.loanByEmployment = loanByEmploymentChart;
}

// Initialize Customer Segments Section
function initializeSegments() {
    if (!dashboardData || !dashboardData.segmentation_data) return;
    
    // Segment Distribution Chart
    const segmentData = dashboardData.segmentation_data.clusters || {};
    const segmentDistChart = new Chart(
        document.getElementById('segment-distribution-chart'),
        {
            type: 'pie',
            data: {
                labels: Object.keys(segmentData).map(key => `Segment ${parseInt(key) + 1}`),
                datasets: [{
                    data: Object.values(segmentData),
                    backgroundColor: [
                        'rgba(0, 104, 62, 0.8)',
                        'rgba(255, 184, 28, 0.8)',
                        'rgba(45, 156, 219, 0.8)',
                        'rgba(156, 39, 176, 0.8)'
                    ],
                    borderColor: 'white',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                    }
                }
            }
        }
    );
    charts.segmentDist = segmentDistChart;
    
    // Segment Profiles Chart
    const segmentProfiles = dashboardData.segmentation_data.cluster_profiles || {};
    
    // Prepare data for segment profiles
    const segmentLabels = Object.keys(segmentProfiles).map(key => `Segment ${parseInt(key) + 1}`);
    const avgAgeData = Object.values(segmentProfiles).map(profile => profile?.avg_age || 0);
    const avgBalanceData = Object.values(segmentProfiles).map(profile => profile?.avg_balance || 0);
    const avgCreditScoreData = Object.values(segmentProfiles).map(profile => profile?.avg_credit_score || 0);
    const avgTransactionsData = Object.values(segmentProfiles).map(profile => profile?.avg_transactions || 0);
    
    const segmentProfilesChart = new Chart(
        document.getElementById('segment-profiles-chart'),
        {
            type: 'bar',
            data: {
                labels: segmentLabels,
                datasets: [
                    {
                        label: 'Average Age',
                        data: avgAgeData,
                        backgroundColor: 'rgba(0, 104, 62, 0.7)',
                        borderColor: 'rgba(0, 104, 62, 1)',
                        borderWidth: 1,
                        yAxisID: 'y-age'
                    },
                    {
                        label: 'Average Credit Score',
                        data: avgCreditScoreData,
                        backgroundColor: 'rgba(255, 184, 28, 0.7)',
                        borderColor: 'rgba(255, 184, 28, 1)',
                        borderWidth: 1,
                        yAxisID: 'y-credit'
                    },
                    {
                        label: 'Average Transactions',
                        data: avgTransactionsData,
                        backgroundColor: 'rgba(45, 156, 219, 0.7)',
                        borderColor: 'rgba(45, 156, 219, 1)',
                        borderWidth: 1,
                        yAxisID: 'y-txn'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    'y-age': {
                        type: 'linear',
                        position: 'left',
                        title: {
                            display: true,
                            text: 'Age'
                        },
                        beginAtZero: true
                    },
                    'y-credit': {
                        type: 'linear',
                        position: 'right',
                        title: {
                            display: true,
                            text: 'Credit Score'
                        },
                        beginAtZero: true,
                        grid: {
                            drawOnChartArea: false
                        }
                    },
                    'y-txn': {
                        type: 'linear',
                        position: 'right',
                        title: {
                            display: true,
                            text: 'Transactions'
                        },
                        beginAtZero: true,
                        grid: {
                            drawOnChartArea: false
                        }
                    }
                }
            }
        }
    );
    charts.segmentProfiles = segmentProfilesChart;
    
    // Only create radar chart if we have segment profiles
    if (Object.keys(segmentProfiles).length > 0) {
        // Segment Radar Chart (using ApexCharts)
        const segmentRadarOptions = {
            series: Object.keys(segmentProfiles).map(key => {
                const profile = segmentProfiles[key] || {};
                return {
                    name: `Segment ${parseInt(key) + 1}`,
                    data: [
                        normalizeForRadar(profile.avg_balance || 0, 'balance'),
                        normalizeForRadar(profile.avg_age || 0, 'age'),
                        normalizeForRadar(profile.avg_credit_score || 0, 'credit'),
                        normalizeForRadar(profile.avg_transactions || 0, 'transactions')
                    ]
                };
            }),
            chart: {
                height: 350,
                type: 'radar',
                dropShadow: {
                    enabled: true,
                    blur: 1,
                    left: 1,
                    top: 1
                }
            },
            title: {
                text: 'Segment Comparison (Normalized)'
            },
            stroke: {
                width: 2
            },
            fill: {
                opacity: 0.1
            },
            markers: {
                size: 5,
                hover: {
                    size: 10
                }
            },
            xaxis: {
                categories: ['Balance', 'Age', 'Credit Score', 'Transaction Frequency']
            }
        };
        
        const segmentRadarChart = new ApexCharts(document.getElementById('segment-radar-chart'), segmentRadarOptions);
        segmentRadarChart.render();
    }
}

// Helper function to normalize values for radar chart (0-100 scale)
function normalizeForRadar(value, type) {
    // Approximate normalization based on expected ranges
    switch(type) {
        case 'balance':
            return Math.min(100, value / 50000 * 100);
        case 'age':
            return Math.min(100, value / 80 * 100);
        case 'credit':
            return Math.min(100, value / 850 * 100);
        case 'transactions':
            return Math.min(100, value / 30 * 100);
        default:
            return value;
    }
}
