// ==UserScript==
// @name         Amazon keywords Positioning by Asin
// @namespace    http://tampermonkey.net/
// @version      1.2.0
// @description  1.在亚马逊搜索结果页上定位ASIN, 获取排名. 支持多ASIN管理和搜索进度提示
// @author       You
// @match        https://www.amazon.com/*
// @match        https://www.amazon.co.uk/*
// @match        https://www.amazon.ca/*
// @icon         https://www.amazon.com/favicon.ico
// @license      MIT
// @grant        none
// ==/UserScript==


(function () {
    'use strict';

    // globe attr
    const MAX_PAGES = 2; // 最大翻页次数

    // 初始化搜索
    let currentPage = 1;
    let targetASIN = '';
    let foundResults = {
        natural: null,
        sponsored: null //广告位置
    };
    // 是否找到目标ASIN
    let isFound = false
    // 监听
    function initPageObserver(asin) {
        // MutationObserver实例变化时（翻页）调用其回调函数
        const observer = new MutationObserver(() => {
            if (findAndHighlight(asin)) {
                observer.disconnect();
                isFound = true;
                statusDiv.textContent = `✅已定位到ASIN-${asin} 第${foundResults.natural.page}页 排名${foundResults.natural.position}`;
            }
        });
        // MutationObserver 实例-监听页面 DOM 的增删改
        observer.observe(document.body, { childList: true, subtree: true });
    }
    // 查找&高亮
    function findAndHighlight(asin) {
        const elem = document.querySelector(`[data-asin="${asin}"]`);
        searchPageAndRank()
        if (elem) {
            // 高亮显示并滚动到视图
            elem.style.border = '2px solid red';
            elem.style.padding = '5px';
            elem.scrollIntoView({ behavior: 'smooth', block: 'center' });

            // 状态栏立即更新
            statusDiv.textContent = `✅已定位到ASIN-${asin} 第${foundResults.natural.page}页 排名${foundResults.natural.position}`;
            // 1.输出其页数和排名
            return true;
        }
        return false;
    }
    // 搜索ASIN
    function searchAsin(asin) {
        statusDiv.textContent = `🔎 正在搜索 ASIN: ${asin} ...`;
        isFound = false;
        // 启动观察器 —— 第一次调用findAndHighlight在new MutationObserver中调用
        initPageObserver(asin);

        // 第一页没找到-翻页
        if (!findAndHighlight(asin)) {
            const nextBtn = document.querySelector('.s-pagination-next');
            if (nextBtn && !nextBtn.classList.contains('s-pagination-disabled')) {
                statusDiv.textContent = '未在当前页找到, 正在翻页...';

                // 执行点击并监听变化
                nextBtn.click();
                currentPage++
            } else {
                statusDiv.textContent = '❌ 未找到目标 ASIN';
            }
        } else {
            // 如果已经找到，立即显示状态
            statusDiv.textContent = `✅ 已定位到 ASIN ${asin}`;
        }
    }

    // 搜索排名和位置
    function searchPageAndRank() {
        // div[data-asin]是搜索结果asin框 获取当前页所有产品节点
        const products = document.querySelectorAll('div[data-asin]');
        let naturalIndex = 0, sponsoredIndex = 0;
        for (const product of products) {
            // 取得Asin值
            const asin = product.getAttribute('data-asin');
            if (!asin) continue;

            // 一次性查询节点，减少多次 DOM 查询
            const isSponsored = product.querySelector('.s-sponsored-label') !== null;
            const hasAddToCart = product.querySelector('span.a-button-inner button.a-button-text') !== null;
            if (!hasAddToCart) continue;

            // 累加自然位和广告位的计数
            if (isSponsored) {
                sponsoredIndex++;
            } else {
                naturalIndex++;
            }

            // 如果找到目标 ASIN，记录位置信息
            if (asin === targetASIN) {
                if (isSponsored && !foundResults.sponsored) {
                    foundResults.sponsored = { page: currentPage, position: sponsoredIndex };
                } else if (!isSponsored && !foundResults.natural) {
                    foundResults.natural = { page: currentPage, position: naturalIndex };
                }

                // 如果都找到了，直接结束遍历，提升效率
                if (foundResults.sponsored && foundResults.natural) break;
            }
        }
    }

    // 停止搜索
    function stopSearch() {
        statusDiv.textContent = '搜索已停止';
    }
    // 构建 UI 容器
    const container = document.createElement('div');
    container.id = 'tm-asin-container';
    container.style.position = 'fixed';
    container.style.top = '98px';
    container.style.transition = 'top 0.4s ease'; /* 动画过渡 */
    container.style.left = '0';
    container.style.width = '100%';
    container.style.backgroundColor = '#fff';
    container.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
    container.style.zIndex = '9999';
    container.style.display = 'flex';
    container.style.flexWrap = 'wrap';
    container.style.alignItems = 'center';
    container.style.padding = '5px 10px';
    container.style.fontFamily = 'Arial, sans-serif';

    let lastScrollY = window.scrollY;
    let isScrolling;
    window.addEventListener("scroll", () => {
        // 清除之前的计时器，避免频繁触发
        window.cancelAnimationFrame(isScrolling);

        // 用 requestAnimationFrame 优化性能
        isScrolling = window.requestAnimationFrame(() => {
            const currentScrollY = window.scrollY;
            const isScrollingDown = currentScrollY > lastScrollY;

            container.style.top = isScrollingDown ? "0px" : "55px";
            lastScrollY = currentScrollY;
        });
    });

    // 搜索ASIN控件
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = '要定位的 ASIN';
    searchInput.style.marginRight = '5px';
    container.appendChild(searchInput);

    const locateBtn = document.createElement('button');
    locateBtn.textContent = '定位&跳转';
    locateBtn.className = 'tm-btn';
    locateBtn.style.marginRight = '5px';
    locateBtn.addEventListener('click', () => {
        const asin = searchInput.value.trim();
        targetASIN = asin
        if (!targetASIN) {
            return alert('请输入有效的ASIN！');
        }
        currentPage = 1;
        foundResults = {
            natural: null,
            sponsored: null
        };
        searchAsin(targetASIN);
    });
    container.appendChild(locateBtn);

    const stopBtn = document.createElement('button');
    stopBtn.textContent = '停止';
    stopBtn.className = 'tm-btn';
    stopBtn.style.marginRight = '10px';
    stopBtn.addEventListener('click', stopSearch);
    container.appendChild(stopBtn);

    // 状态显示区域
    const statusDiv = document.createElement('span');
    statusDiv.id = 'tm-status';
    statusDiv.style.marginLeft = '10px';
    container.appendChild(statusDiv);

    document.body.appendChild(container);

    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
        #tm-asin-container button.tm-btn {
            padding: 4px 8px;
            border: 1px solid #888;
            background-color: #eee;
            border-radius: 3px;
            cursor: pointer;
        }
        #tm-asin-container button.tm-btn:hover {
            background-color: #ddd;
        }
        #tm-asin-container input {
            padding: 4px 6px;
            border: 1px solid #ccc;
            border-radius: 3px;
        }
        #tm-status button {
            margin-left: 5px;
        }
    `;
    document.head.appendChild(style);

    updateSavedListUI();
})();