// ==UserScript==
// @name         Amazon keywords Positioning by Asin
// @namespace    http://tampermonkey.net/
// @version      1.1.0
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
    const SEARCH_KEY = 'tm_searchAsins';
    const SAVED_KEY = 'tm_savedAsins';
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
    // 页面加载完成后执行
    window.onload = () => {
        loadSavedAsins();
    };
    // 载入已经保存的ASIN
    function loadSavedAsins() {
        const list = localStorage.getItem(SAVED_KEY);
        return list ? JSON.parse(list) : [];
    }
    // 保存已保存 ASIN 列表
    function saveSavedAsins(list) {
        localStorage.setItem(SAVED_KEY, JSON.stringify(list));
    }
    // 更新已保存 ASIN 列表的 UI 显示
    function updateSavedListUI() {
        savedListDiv.innerHTML = '';
        loadSavedAsins().forEach(asin => {
            const item = document.createElement('div');
            item.className = 'tm-saved-item';
            item.textContent = asin;

            const delBtn = document.createElement('button');
            delBtn.textContent = '删除';
            delBtn.className = 'tm-btn';

            delBtn.addEventListener('click', () => {
                // 过滤删除
                const newList = loadSavedAsins().filter(a => a !== asin);
                saveSavedAsins(newList);
                updateSavedListUI();
            });
            item.appendChild(delBtn);
            savedListDiv.appendChild(item);
        });
    }
    
    function initPageObserver(asin) {
        const observer = new MutationObserver(() => {
            if (findAndHighlight(asin)) {
                observer.disconnect();
                isFound = true;
                statusDiv.textContent = `✅ 已定位到 ASIN ${asin}`;
                localStorage.removeItem('SEARCH_KEY');
            }
        });
    
        observer.observe(document.body, { childList: true, subtree: true });
    }
    // 查找&高亮
    function findAndHighlight(asin) {
        const elem = document.querySelector(`[data-asin="${asin}"]`);
        if (elem) {
            // 🔹 高亮显示并滚动到视图
            elem.style.border = '2px solid red';
            elem.style.padding = '5px';
            elem.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
            // 🔹 状态栏立即更新
            statusDiv.textContent = `✅ 已定位到 ASIN ${asin}`;
            return true;
        }
        return false;
    }
    // 搜索ASIN
    function searchAsin(asin) {
        statusDiv.textContent = `🔎 正在搜索 ASIN: ${asin} ...`;
        isFound = false;
        initPageObserver(asin);
    
        if (!findAndHighlight(asin)) {
            const nextBtn = document.querySelector('.s-pagination-next');
            if (nextBtn && !nextBtn.classList.contains('s-pagination-disabled')) {
                statusDiv.textContent = '未在当前页找到, 正在翻页...';
    
                // 存储状态
                localStorage.setItem('SEARCH_KEY', asin);
    
                // 执行点击并监听变化
                nextBtn.click();
            } else {
                statusDiv.textContent = '❌ 未找到目标 ASIN';
                localStorage.removeItem('SEARCH_KEY');
            }
        } else {
            // 如果已经找到，立即显示状态
            statusDiv.textContent = `✅ 已定位到 ASIN ${asin}`;
            localStorage.removeItem('SEARCH_KEY');
        }
    }

    function searchPage() {
        // div[data-asin]是搜索结果asin框 获取当前页所有产品节点
        const products = document.querySelectorAll('div[data-asin]');

        // 初始化计数器
        let naturalIndex = 0, sponsoredIndex = 0;

        for (const product of products) {
            // 取得Asin值
            const asin = div.getAttribute('data-asin');
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

        // 判断是否需要进入下一页 ?是不是不需要翻页了
        if (foundResults.natural && foundResults.sponsored) {
            showResults();
        } else if (currentPage < MAX_PAGES) {
            const nextPage = document.querySelector('a.s-pagination-next');
            if (nextPage) {
                currentPage++;
                nextPage.click();
                setTimeout(searchPage, 3000);
            } else {
                showResults();
            }
        } else {
            showResults();
        }
    }

    // 结果直接显示在顶栏
    function showResults() {
        let message = `搜索完成：\n`;
        if (results.natural) {
            message += `自然位: 第 ${results.natural.page} 页，第 ${results.natural.position} 个位置\n`;
        } else {
            message += `自然位: 未找到\n`;
        }
        if (results.sponsored) {
            message += `广告位: 第 ${results.sponsored.page} 页，第 ${results.sponsored.position} 个位置\n`;
        } else {
            message += `广告位: 未找到\n`;
        }
        alert(message);
    }

    // 停止搜索
    function stopSearch() {
        localStorage.removeItem(SEARCH_KEY);
        statusDiv.textContent = '搜索已停止';
    }
    // 构建 UI 容器
    const container = document.createElement('div');
    container.id = 'tm-asin-container';
    container.style.position = 'fixed';
    container.style.top = '60px';
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

    // 已保存 ASIN 列表区域
    const savedListDiv = document.createElement('div');
    savedListDiv.id = 'tm-saved-list';
    savedListDiv.style.display = 'flex';
    savedListDiv.style.flexWrap = 'wrap';
    savedListDiv.style.marginRight = '15px';
    container.appendChild(savedListDiv);

    // 添加ASIN控件
    const addInput = document.createElement('input');
    addInput.type = 'text';
    addInput.placeholder = '新增 ASIN';
    addInput.style.marginRight = '5px';
    container.appendChild(addInput);

    const addBtn = document.createElement('button');
    addBtn.textContent = '添加';
    addBtn.className = 'tm-btn';
    addBtn.style.marginRight = '15px';
    addBtn.addEventListener('click', () => {
        const asin = addInput.value.trim();
        if (!asin) return;
        let list = loadSavedAsins();
        if (!list.includes(asin)) {
            list.push(asin);
            saveSavedAsins(list);
            updateSavedListUI();
        }
        addInput.value = '';
    });
    container.appendChild(addBtn);

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
        localStorage.setItem(SEARCH_KEY, targetASIN);
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
        #tm-saved-list .tm-saved-item {
            display: flex;
            align-items: center;
            margin-right: 8px;
            padding: 2px 4px;
            border: 1px dashed #ccc;
            border-radius: 3px;
        }
        #tm-saved-list .tm-saved-item button {
            margin-left: 4px;
        }
        #tm-status button {
            margin-left: 5px;
        }
    `;
    document.head.appendChild(style);

    updateSavedListUI();
    // 继续上次的搜索（如果存在）
    const pending = localStorage.getItem(SEARCH_KEY);
    if (pending) {
        searchInput.value = pending;
        searchAsin(pending);
    }
})();