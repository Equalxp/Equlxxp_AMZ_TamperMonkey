// ==UserScript==
// @name         Amazon keywords Positioning by Asin
// @namespace    http://tampermonkey.net/
// @version      1.0.0
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

    const SEARCH_KEY = 'tm_searchAsins';
    const SAVED_KEY = 'tm_savedAsins';

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
    // 查找并高亮 ASIN 元素
    function findAndHighlight(asin) {
        // 获取asin结果框
        const elem = document.querySelector(`[data-asin="${asin}"]`)
        if (elem) {
            elem.style.border = "2px solid red"
            elem.style.padding = '5px';
            // scrollIntoView滚动至elem元素
            elem.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return true;
        }
        return false
    }
    // 执行搜索：找不到时自动翻页
    function searchAsin(asin) {
        statusDiv.textContent = `搜索ASIN: ${asin} ...`;
        if (findAndHighlight(asin)) {
            statusDiv.textContent = `已定位到ASIN ${asin}`;
            // 添加跳转按钮
            const jumpBtn = document.createElement('button');
            jumpBtn.textContent = '跳转到该ASIN';
            jumpBtn.className = 'tm-btn';
            jumpBtn.addEventListener('click', () => {
                const elem = document.querySelector(`[data-asin="${asin}"]`);
                if (elem) elem.scrollIntoView({ behavior: 'smooth', block: 'center' });
            });

            statusDiv.appendChild(jumpBtn);
            localStorage.removeItem(SEARCH_KEY);
        } else {
            // 当前页未找到，尝试翻页
            const nextBtn = document.querySelector('.s-pagination-next');
            if (nextBtn && !nextBtn.classList.contains('s-pagination-disabled')) {
                statusDiv.textContent = '未在当前页找到, 翻页中...';
                nextBtn.click();
                // 翻页后，脚本会重新运行并继续搜索
            } else {
                statusDiv.textContent = '未找到目标ASIN';
                localStorage.removeItem(SEARCH_KEY);
            }
        }
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
    locateBtn.textContent = '定位';
    locateBtn.className = 'tm-btn';
    locateBtn.style.marginRight = '5px';
    locateBtn.addEventListener('click', () => {
        const asin = searchInput.value.trim();
        if (!asin) return;
        localStorage.setItem(SEARCH_KEY, asin);
        searchAsin(asin);
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