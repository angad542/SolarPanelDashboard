let powerChart;
let currentData = {
    productionData: [],
    consumptionData: [],
    timeLabels: []
};

document.addEventListener('DOMContentLoaded', function() {
    initializeChart();
    updateTimeDisplay();
    
    setInterval(updateTimeDisplay, 1000);
});

function initializeChart() {
    const ctx = document.getElementById('powerChart').getContext('2d');
    
    generateChartData();
    
    powerChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: currentData.timeLabels,
            datasets: [{
                label: 'Production Power',
                data: currentData.productionData,
                borderColor: '#2196f3',
                backgroundColor: 'rgba(33, 150, 243, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 6,
                borderWidth: 2
            }, {
                label: 'Consumption Power',
                data: currentData.consumptionData,
                borderColor: '#f44336',
                backgroundColor: 'rgba(244, 67, 54, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 6,
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    titleColor: '#333',
                    bodyColor: '#666',
                    borderColor: '#ddd',
                    borderWidth: 1,
                    cornerRadius: 8,
                    displayColors: true
                }
            },
            scales: {
                x: {
                    grid: {
                        display: true,
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        color: '#666',
                        font: {
                            size: 12
                        }
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        display: true,
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        color: '#666',
                        font: {
                            size: 12
                        },
                        callback: function(value) {
                            return value.toFixed(1) + ' MW';
                        }
                    }
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            },
            elements: {
                line: {
                    tension: 0.4
                }
            }
        }
    });
}

function generateChartData() {
    let timeRange = 24;
    let maxProduction = 1.8;
    let maxConsumption = 0.8;
    if (document.getElementById('timeRange')) {
        timeRange = parseInt(document.getElementById('timeRange').value);
    }
    if (document.getElementById('maxProduction')) {
        maxProduction = parseFloat(document.getElementById('maxProduction').value);
    }
    if (document.getElementById('maxConsumption')) {
        maxConsumption = parseFloat(document.getElementById('maxConsumption').value);
    }
    currentData.timeLabels = [];
    currentData.productionData = [];
    currentData.consumptionData = [];
    const startHour = 24 - timeRange;
    for (let i = 0; i < timeRange; i++) {
        const hour = (startHour + i) % 24;
        const timeLabel = hour.toString().padStart(2, '0') + ':00';
        currentData.timeLabels.push(timeLabel);
        let productionValue = 0;
        if (hour >= 6 && hour <= 18) {
            const sunAngle = (hour - 12) / 6;
            productionValue = maxProduction * Math.exp(-Math.pow(sunAngle, 2) * 2) + (Math.random() - 0.5) * 0.1;
            productionValue = Math.max(0, productionValue);
        }
        let consumptionValue = maxConsumption * 0.2;
        if (hour >= 7 && hour <= 22) {
            consumptionValue += maxConsumption * 0.6 * (1 + Math.sin((hour - 7) * Math.PI / 15));
        }
        consumptionValue += (Math.random() - 0.5) * 0.1;
        consumptionValue = Math.max(0.1, consumptionValue);
        currentData.productionData.push(productionValue);
        currentData.consumptionData.push(consumptionValue);
    }
}

function updateChart() {
    let timeRange = 24;
    if (document.getElementById('timeRange')) {
        timeRange = document.getElementById('timeRange').value;
        document.getElementById('timeValue').textContent = timeRange;
    }
    generateChartData();
    if (powerChart) {
        powerChart.data.labels = currentData.timeLabels;
        powerChart.data.datasets[0].data = currentData.productionData;
        powerChart.data.datasets[1].data = currentData.consumptionData;
        powerChart.update('active');
    }
    updateStats();
}

function updateStats() {
    const totalProduction = currentData.productionData.reduce((sum, val) => sum + val, 0).toFixed(2);
    const totalConsumption = currentData.consumptionData.reduce((sum, val) => sum + val, 0).toFixed(2);
    
    document.getElementById('totalProduction').textContent = totalProduction + 'MWh';
    
    const selfUsedRatio = totalConsumption > 0 ? (Math.min(totalProduction, totalConsumption) / totalConsumption * 100).toFixed(1) : 0;
    document.getElementById('selfUsedRatio').textContent = selfUsedRatio + '%';
    
    const gridFeedIn = Math.max(0, totalProduction - totalConsumption).toFixed(1);
    document.getElementById('totalGridFeed').textContent = gridFeedIn + 'MWh';
}

function resetChart() {
    document.getElementById('timeRange').value = 24;
    document.getElementById('maxProduction').value = 1.8;
    document.getElementById('maxConsumption').value = 0.8;
    updateChart();
}


function showDataOverview() {
    const overview = `
        Production Peak: ${Math.max(...currentData.productionData).toFixed(2)} MW
        Consumption Peak: ${Math.max(...currentData.consumptionData).toFixed(2)} MW
        Total Production: ${currentData.productionData.reduce((sum, val) => sum + val, 0).toFixed(2)} MWh
        Total Consumption: ${currentData.consumptionData.reduce((sum, val) => sum + val, 0).toFixed(2)} MWh
    `;
    alert(overview);
}

function updateTimeDisplay() {
    const now = new Date();
    const timeString = now.toLocaleTimeString();
}

document.addEventListener('DOMContentLoaded', function() {
    const dateSelector = document.getElementById('dateSelector');
    if (dateSelector) {
        dateSelector.addEventListener('change', function() {
            updateChart();
        });
    }
});

window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
        document.querySelector('.sidebar').classList.remove('open');
    }
});

document.addEventListener('click', function(e) {
    const sidebar = document.querySelector('.sidebar');
    const hamburger = document.querySelector('.hamburger');
    
    if (window.innerWidth <= 768 && sidebar.classList.contains('open')) {
        if (!sidebar.contains(e.target) && !hamburger.contains(e.target)) {
            sidebar.classList.remove('open');
        }
    }
});