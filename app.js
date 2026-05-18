document.addEventListener('DOMContentLoaded', function() {
    const tabs = document.querySelectorAll('.tab');
    const orderLists = {
        pending: document.getElementById('pending-list'),
        delivering: document.getElementById('delivering-list'),
        completed: document.getElementById('completed-list')
    };

    let todayOrders = 0;
    let todayIncome = 0;

    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            Object.keys(orderLists).forEach(key => {
                orderLists[key].classList.add('hidden');
            });
            orderLists[tabName].classList.remove('hidden');
        });
    });

    const acceptButtons = document.querySelectorAll('.btn-primary[id^="accept-"]');
    acceptButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const orderId = this.id.replace('accept-', '');
            const orderCard = document.querySelector(`[data-order-id="${orderId}"]`);
            const price = parseFloat(orderCard.querySelector('.price').textContent.replace('¥', ''));
            
            orderCard.classList.add('active-order');
            
            orderCard.innerHTML = `
                <div class="progress-bar">
                    <div class="progress-fill" style="width: 30%"></div>
                    <div class="progress-steps">
                        <span class="step completed">已接单</span>
                        <span class="step active">配送中</span>
                        <span class="step">已送达</span>
                    </div>
                </div>
                <div class="card-header">
                    <div class="order-id">#${orderId}</div>
                    <div class="order-status delivering">配送中</div>
                </div>
                <div class="card-body">
                    <div class="route-info">
                        <div class="point">
                            <div class="point-icon shop">
                                <i class="ri-store-2-fill"></i>
                            </div>
                            <div class="point-info">
                                <div class="point-name">${orderCard.querySelector('.point-name').textContent}</div>
                                <div class="point-address">${orderCard.querySelector('.point-address').textContent}</div>
                            </div>
                        </div>
                        <div class="route-line active">
                            <div class="line-progress" style="width: 30%"></div>
                        </div>
                        <div class="point">
                            <div class="point-icon user">
                                <i class="ri-user-fill"></i>
                            </div>
                            <div class="point-info">
                                <div class="point-name">${orderCard.querySelectorAll('.point-name')[1].textContent}</div>
                                <div class="point-address">${orderCard.querySelectorAll('.point-address')[1].textContent}</div>
                            </div>
                        </div>
                    </div>
                    <div class="delivery-info">
                        <div class="info-item">
                            <i class="ri-clock-line"></i>
                            <span>剩余 25分钟</span>
                        </div>
                        <div class="info-item">
                            <i class="ri-route-line"></i>
                            <span>距离 ${orderCard.querySelector('.distance').textContent}</span>
                        </div>
                    </div>
                </div>
                <div class="card-footer">
                    <div class="contact-btns">
                        <button class="contact-btn call-shop">
                            <i class="ri-phone-line"></i>
                            <span>联系商家</span>
                        </button>
                        <button class="contact-btn call-user">
                            <i class="ri-phone-line"></i>
                            <span>联系用户</span>
                        </button>
                    </div>
                    <div class="action-btns">
                        <button class="btn-secondary arrive-btn">已到店</button>
                        <button class="btn-success complete-btn">已送达</button>
                    </div>
                </div>
            `;

            orderLists.delivering.appendChild(orderCard);
            
            todayOrders++;
            todayIncome += price;
            updateStats();
            
            tabs[1].click();
            
            setupDeliveryOrder(orderCard, price);
        });
    });

    function setupDeliveryOrder(card, price) {
        const arriveBtn = card.querySelector('.arrive-btn');
        const completeBtn = card.querySelector('.complete-btn');
        const callShopBtn = card.querySelector('.call-shop');
        const callUserBtn = card.querySelector('.call-user');
        
        arriveBtn.addEventListener('click', function() {
            this.textContent = '已到店 ✓';
            this.style.backgroundColor = '#E6F7E6';
            this.style.color = '#52C41A';
            
            const progressFill = card.querySelector('.progress-fill');
            const lineProgress = card.querySelector('.line-progress');
            progressFill.style.width = '60%';
            lineProgress.style.width = '60%';
            
            const steps = card.querySelectorAll('.step');
            steps[0].classList.add('completed');
            steps[1].classList.add('active');
            
            card.querySelector('.info-item:first-child span').textContent = '剩余 15分钟';
        });
        
        completeBtn.addEventListener('click', function() {
            const orderId = card.getAttribute('data-order-id');
            const now = new Date();
            const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
            
            card.innerHTML = `
                <div class="card-header">
                    <div class="order-id">#${orderId}</div>
                    <div class="order-status completed">已完成</div>
                </div>
                <div class="card-body">
                    <div class="route-info">
                        <div class="point">
                            <div class="point-icon shop">
                                <i class="ri-store-2-fill"></i>
                            </div>
                            <div class="point-info">
                                <div class="point-name">${card.querySelector('.point-name').textContent}</div>
                                <div class="point-address">${card.querySelector('.point-address').textContent}</div>
                            </div>
                        </div>
                        <div class="route-line">
                            <div class="line-dots completed"></div>
                        </div>
                        <div class="point">
                            <div class="point-icon user">
                                <i class="ri-user-fill"></i>
                            </div>
                            <div class="point-info">
                                <div class="point-name">${card.querySelectorAll('.point-name')[1].textContent}</div>
                                <div class="point-address">${card.querySelectorAll('.point-address')[1].textContent}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card-footer">
                    <div class="order-meta">
                        <span class="completed-time">${timeStr} 完成</span>
                        <span class="price">¥${price.toFixed(1)}</span>
                    </div>
                    <button class="btn-outline">查看详情</button>
                </div>
            `;
            
            card.classList.remove('active-order');
            orderLists.completed.appendChild(card);
            tabs[2].click();
        });
        
        callShopBtn.addEventListener('click', function() {
            showModal('联系商家', '<p>正在拨打商家电话...</p>');
        });
        
        callUserBtn.addEventListener('click', function() {
            showModal('联系用户', '<p>正在拨打用户电话...</p>');
        });
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

    const refreshBtn = document.getElementById('refresh-btn');
    refreshBtn.addEventListener('click', function() {
        this.classList.add('refreshing');
        setTimeout(() => {
            this.classList.remove('refreshing');
        }, 1000);
    });

    const messageBtn = document.getElementById('message-btn');
    messageBtn.addEventListener('click', function() {
        showModal('消息通知', '<p>您有 3 条未读消息</p>');
    });

    const modalOverlay = document.getElementById('modal-overlay');
    const modalClose = document.getElementById('modal-close');
    
    function showModal(title, content) {
        document.querySelector('.modal-header h3').textContent = title;
        document.getElementById('modal-body').innerHTML = content;
        modalOverlay.classList.add('show');
    }
    
    modalClose.addEventListener('click', function() {
        modalOverlay.classList.remove('show');
    });
    
    modalOverlay.addEventListener('click', function(e) {
        if (e.target === modalOverlay) {
            modalOverlay.classList.remove('show');
        }
    });

    const quickBtns = document.querySelectorAll('.quick-btn');
    quickBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.textContent.includes('导航')) {
                showModal('导航', '<p>正在启动导航...</p>');
            } else if (this.textContent.includes('客服')) {
                showModal('客服', '<p>正在连接客服...</p>');
            } else if (this.textContent.includes('帮助')) {
                showModal('帮助中心', '<p>骑手帮助文档加载中...</p>');
            }
        });
    });

    const deliveringCard = document.querySelector('#delivering-list .order-card');
    if (deliveringCard) {
        const priceText = deliveringCard.querySelector('.price');
        if (priceText) {
            const price = parseFloat(priceText.textContent.replace('¥', ''));
            setupDeliveryOrder(deliveringCard, price);
        }
    }
});
