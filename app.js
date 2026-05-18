document.addEventListener('DOMContentLoaded', function() {
    let todayOrders = 0;
    let todayIncome = 0;

    const tabBtns = document.querySelectorAll('.tab-btn');
    const ordersSections = {
        pending: document.getElementById('pending-orders'),
        delivering: document.getElementById('delivering-orders'),
        completed: document.getElementById('completed-orders')
    };

    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tab = this.getAttribute('data-tab');
            
            tabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            Object.keys(ordersSections).forEach(key => {
                if (key === tab) {
                    ordersSections[key].classList.remove('hidden');
                } else {
                    ordersSections[key].classList.add('hidden');
                }
            });
        });
    });

    const acceptBtns = document.querySelectorAll('.accept-btn');
    acceptBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const orderCard = this.closest('.order-card');
            const orderPrice = parseFloat(orderCard.querySelector('.order-price').textContent.replace('¥', ''));
            
            orderCard.querySelector('.order-footer').innerHTML = `
                <button class="btn arrive-btn">已到店</button>
                <button class="btn complete-btn">已送达</button>
            `;
            
            const orderHeader = orderCard.querySelector('.order-header');
            orderHeader.innerHTML = `
                <span class="order-id">${orderCard.querySelector('.order-id').textContent}</span>
                <span class="order-status delivering">配送中</span>
            `;
            
            ordersSections.delivering.appendChild(orderCard);
            tabBtns[1].click();
            
            todayOrders++;
            todayIncome += orderPrice;
            updateStats();
            
            attachArriveAndCompleteHandlers(orderCard, orderPrice);
        });
    });

    function attachArriveAndCompleteHandlers(orderCard, price) {
        const arriveBtn = orderCard.querySelector('.arrive-btn');
        const completeBtn = orderCard.querySelector('.complete-btn');
        
        if (arriveBtn) {
            arriveBtn.addEventListener('click', function() {
                this.textContent = '已到店 ✓';
                this.style.backgroundColor = '#f6ffed';
                this.style.color = '#52c41a';
            });
        }
        
        if (completeBtn) {
            completeBtn.addEventListener('click', function() {
                const orderId = orderCard.querySelector('.order-id').textContent;
                const now = new Date();
                const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
                
                orderCard.querySelector('.order-header').innerHTML = `
                    <span class="order-id">${orderId}</span>
                    <span class="order-status completed">已完成</span>
                `;
                
                orderCard.querySelector('.order-footer').innerHTML = `
                    <span class="order-time-completed">${timeStr}完成</span>
                    <span class="order-price">¥${price.toFixed(1)}</span>
                `;
                
                ordersSections.completed.appendChild(orderCard);
                tabBtns[2].click();
            });
        }
    }

    function updateStats() {
        const statValues = document.querySelectorAll('.stat-value');
        statValues[0].textContent = todayOrders;
        statValues[1].textContent = `¥${todayIncome.toFixed(1)}`;
    }

    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            navItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
        });
    });

    document.querySelectorAll('.delivering-orders .order-card').forEach(card => {
        const priceText = card.querySelector('.order-price');
        if (priceText) {
            const price = parseFloat(priceText.textContent.replace('¥', ''));
            attachArriveAndCompleteHandlers(card, price);
        }
    });
});
