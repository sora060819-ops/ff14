// script.js

// 存储和加载幻化数据
document.addEventListener("DOMContentLoaded", function() {
    // Load shared navigation fragment (nav.html) and inject into page
    function loadNavFragment() {
        // choose path to nav.html depending on whether current page is in /page/
        const isInPageDir = window.location.pathname.includes('/page/');
        const navPath = isInPageDir ? '../nav.html' : 'nav.html';

        return fetch(navPath)
            .then(function(res) { if (!res.ok) throw new Error('nav not found'); return res.text(); })
            .then(function(html) {
                const temp = document.createElement('div');
                temp.innerHTML = html;
                const header = temp.querySelector('header');
                if (!header) return;

                // If current page is inside /page/, adjust relative links and image src
                if (isInPageDir) {
                    // fix all anchors inside header
                    header.querySelectorAll('a').forEach(function(a) {
                        const href = a.getAttribute('href');
                        if (!href) return;
                        // skip absolute URLs and already-upward relative paths
                        if (/^(https?:|\/|\.\.)/.test(href)) return;
                        a.setAttribute('href', '../' + href);
                    });
                    // fix brand logo src if present
                    const logo = header.querySelector('.brand-logo');
                    if (logo) {
                        const src = logo.getAttribute('src');
                        if (src && !/^(https?:|\/|\.\.)/.test(src)) {
                            logo.setAttribute('src', '../' + src);
                        }
                    }
                }

                // insert the header at the top of the body (before other content)
                document.body.insertBefore(header, document.body.firstChild);

                // Add a small-screen navigation toggle button (if not present)
                try {
                    const nav = header.querySelector('.main-nav');
                    const navList = header.querySelector('.nav-list');
                    if (nav && navList) {
                        // ensure nav-list has an id for aria-controls if needed
                        if (!navList.id) navList.id = 'nav-list-' + Date.now();

                        // create toggle button
                        const toggle = document.createElement('button');
                        toggle.className = 'nav-toggle';
                        toggle.setAttribute('aria-expanded', 'false');
                        toggle.setAttribute('aria-label', 'Toggle navigation');
                        // point toggle to the nav-list for accessibility
                        toggle.setAttribute('aria-controls', navList.id);
                        toggle.innerHTML = '<span class="bar"></span><span class="bar"></span><span class="bar"></span>';

                        // insert toggle next to brand (inside header container)
                        const container = header.querySelector('.container');
                        if (container) container.insertBefore(toggle, nav);

                        // toggle behavior
                        toggle.addEventListener('click', function() {
                            nav.classList.toggle('open');
                            const expanded = nav.classList.contains('open');
                            toggle.setAttribute('aria-expanded', expanded);
                        });

                        // close nav when a link is clicked (mobile friendly)
                        nav.querySelectorAll('.nav-list a').forEach(function(a) {
                            a.addEventListener('click', function() {
                                if (nav.classList.contains('open')) {
                                    nav.classList.remove('open');
                                    toggle.setAttribute('aria-expanded', 'false');
                                }
                            });
                        });
                    }
                } catch (e) {
                    // don't break the page if anything unexpected happens
                    console.warn('nav toggle setup failed', e);
                }

                // mark active link based on current filename
                const currentFile = window.location.pathname.split('/').pop() || 'index.html';
                header.querySelectorAll('.nav-item a').forEach(function(a) {
                    const href = a.getAttribute('href') || '';
                    if (href.endsWith(currentFile) || (currentFile === 'index.html' && href.endsWith('index.html'))) {
                        a.classList.add('active');
                    }
                });
            })
            .catch(function() {
                // silently ignore if nav fragment not found (graceful fallback)
                return;
            });
    }

    // start loading nav but don't block other page init
    loadNavFragment();
    // 从 localStorage 加载幻化数据
    let transmogList = JSON.parse(localStorage.getItem("transmogList")) || [];

    // 在主页显示精选幻化
    const featuredTransmogs = transmogList.slice(0, 3); // 只显示前三个作为精选
    const featuredContainer = document.getElementById("featured-transmogs");
    featuredTransmogs.forEach(function(transmog) {
        const div = document.createElement("div");
        div.classList.add("transmog-item");
        div.innerHTML = `
            <img src="${transmog.image}" alt="${transmog.name}">
            <h3>${transmog.name}</h3>
            <p>${transmog.description}</p>
        `;
        featuredContainer.appendChild(div);
    });

    // 在浏览幻化页面显示所有幻化
    const galleryContainer = document.getElementById("transmog-gallery");
    transmogList.forEach(function(transmog, index) {
        const div = document.createElement("div");
        div.classList.add("transmog-item");
        div.innerHTML = `
            <img src="${transmog.image}" alt="${transmog.name}">
            <h3><a href="transmog-detail.html?id=${index}">${transmog.name}</a></h3>
            <p>${transmog.description}</p>
        `;
        galleryContainer.appendChild(div);
    });

    // 在添加幻化页面处理表单提交
    const form = document.getElementById("add-transmog-form");
    form.addEventListener("submit", function(event) {
        event.preventDefault();
        
        const name = document.getElementById("name").value;
        const image = document.getElementById("image").files[0];
        const head = document.getElementById("head").value;
        const body = document.getElementById("body").value;
        const description = document.getElementById("description").value;

        if (name && image && head && body) {
            const newTransmog = {
                name: name,
                image: URL.createObjectURL(image),
                head: head,
                body: body,
                description: description
            };

            // 保存到 localStorage
            transmogList.push(newTransmog);
            localStorage.setItem("transmogList", JSON.stringify(transmogList));

            alert("幻化添加成功！");
            window.location.href = "browse.html";
        }
    });

    // 在详情页展示幻化详情
    const urlParams = new URLSearchParams(window.location.search);
    const transmogId = urlParams.get('id');
    if (transmogId !== null) {
        const transmog = transmogList[transmogId];
        const detailContainer = document.getElementById("transmog-detail");
        detailContainer.innerHTML = `
            <h2>${transmog.name}</h2>
            <img src="${transmog.image}" alt="${transmog.name}">
            <p>${transmog.description}</p>
            <table>
                <tr><th>头部</th><td>${transmog.head}</td></tr>
                <tr><th>身体</th><td>${transmog.body}</td></tr>
                <!-- 其他部位 -->
            </table>
        `;
    }
});
