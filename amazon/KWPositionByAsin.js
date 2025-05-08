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


(function() {
    'use strict';

    const SEARCH_KEY = 'tm_searchAsin';
    const SAVED_KEY = 'tm_savedAsins';

    // 载入已经保存的ASIN
    function loadSavedAsins() {
        const list = localStorage.getItem(SAVED_KEY);
        return list ? JSON.parse(list) : [];
    }

    // Your code here...
})();