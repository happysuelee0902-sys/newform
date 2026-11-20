
// ============================================
// 소개팅교회 홈페이지
// 콘텐츠는 이 파일 상단에서 수정하세요.
// ============================================


// 1. 설교 영상 데이터
// youtube에 실제 YouTube 링크를 넣으면 재생됩니다.
// 예시가 아닌 영상은 sample: false로 변경하세요.

const sermons = [
    {
        title: "주선자는 누구인가",
        category: "특별 설교",
        date: "영상 등록 예정",
        youtube: "",
        sample: true
    },
    {
        title: "첫 만남의 예법",
        category: "주일 설교",
        date: "영상 등록 예정",
        youtube: "",
        sample: true
    },
    {
        title: "구정전과 신정전",
        category: "경전 강해",
        date: "영상 등록 예정",
        youtube: "",
        sample: true
    },
    {
        title: "인연을 기다리는 자세",
        category: "주일 설교",
        date: "영상 등록 예정",
        youtube: "",
        sample: true
    },
    {
        title: "연락의 의미",
        category: "경전 강해",
        date: "영상 등록 예정",
        youtube: "",
        sample: true
    },
    {
        title: "주선자의 책임",
        category: "특별 설교",
        date: "영상 등록 예정",
        youtube: "",
        sample: true
    }
];


// 2. 경전 데이터
// verses 배열에 실제 경전 문장을 넣으세요.
// 현재 장과 목차는 편집용 예시입니다.

const scriptures = {
    old: [
        {
            title: "만남기",
            chapters: [
                { number: 1, verses: [] },
                { number: 2, verses: [] },
                { number: 3, verses: [] }
            ]
        },
        {
            title: "예법기",
            chapters: [
                { number: 1, verses: [] },
                { number: 2, verses: [] }
            ]
        },
        {
            title: "서신기",
            chapters: [
                { number: 1, verses: [] },
                { number: 2, verses: [] }
            ]
        }
    ],

    new: [
        {
            title: "만남기",
            chapters: [
                { number: 1, verses: [] },
                { number: 2, verses: [] },
                { number: 3, verses: [] }
            ]
        },
        {
            title: "예법기",
            chapters: [
                { number: 1, verses: [] },
                { number: 2, verses: [] }
            ]
        },
        {
            title: "서신기",
            chapters: [
                { number: 1, verses: [] },
                { number: 2, verses: [] }
            ]
        }
    ]
};


// 3. 교회 소식

const newsData = [
    {
        title: "소개팅교회 홈페이지 안내",
        date: "날짜 미정",
        body: "홈페이지 안내문을 입력할 수 있는 예시 공지입니다.",
        sample: true
    },
    {
        title: "주선자 모집 안내",
        date: "날짜 미정",
        body: "주선자 모집 일정과 내용을 확정한 뒤 게시하세요.",
        sample: true
    },
    {
        title: "경전 열람 안내",
        date: "날짜 미정",
        body: "구정전과 신정전의 확정 원고를 등록할 수 있습니다.",
        sample: true
    }
];


// ============================================
// 공통 도구
// ============================================

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}

function getYoutubeId(value) {
    const input = String(value || "").trim();
    const pattern = /^[a-zA-Z0-9_-]{11}$/;

    if (pattern.test(input)) return input;

    try {
        const url = new URL(input);

        if (url.protocol !== "https:") return null;

        let id = null;

        if (url.hostname === "youtu.be") {
            id = url.pathname.split("/")[1];
        }

        if ([
            "youtube.com",
            "www.youtube.com",
            "m.youtube.com"
        ].includes(url.hostname)) {
            const parts = url.pathname.split("/");

            if (parts[1] === "watch") {
                id = url.searchParams.get("v");
            }

            if (["embed", "shorts", "live"].includes(parts[1])) {
                id = parts[2];
            }
        }

        return pattern.test(id || "") ? id : null;

    } catch {
        return null;
    }
}


// ============================================
// 페이지 이동
// ============================================

const pages = document.querySelectorAll(".page");
const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

function closeMenu() {
    mainNav.classList.remove("open");
    menuToggle.textContent = "☰";
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "메뉴 열기");
}

function showPage() {
    const hash = location.hash.substring(1);
    const pageName = hash.split("/")[0] || "home";

    const target = document.getElementById(pageName);
    const validPage = target && target.classList.contains("page")
        ? pageName
        : "home";

    pages.forEach(page => {
        page.classList.toggle("active", page.id === validPage);
    });

    document.querySelectorAll(".main-nav a").forEach(link => {
        link.classList.toggle(
            "active",
            link.getAttribute("href") === `#${validPage}`
        );
    });

    closeMenu();

    if (validPage === "old" || validPage === "new") {
        const parts = hash.split("/");

        const bookIndex = Number(parts[1] || 0);
        const chapterIndex = Number(parts[2] || 0);

        renderScripture(
            validPage,
            bookIndex,
            chapterIndex
        );
    }

    const titles = {
        home: "소개팅교회",
        about: "교회 소개",
        sermons: "말씀과 설교",
        old: "구정전",
        new: "신정전",
        recruit: "주선자 모집",
        news: "교회 소식"
    };

    document.title = `${titles[validPage]} | 소개팅교회`;
    window.scrollTo(0, 0);
}

menuToggle.addEventListener("click", () => {
    const open = mainNav.classList.toggle("open");

    menuToggle.textContent = open ? "×" : "☰";
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute(
        "aria-label",
        open ? "메뉴 닫기" : "메뉴 열기"
    );
});

window.addEventListener("hashchange", showPage);


// ============================================
// 설교 영상
// ============================================

function sermonCard(sermon, index) {
    return `
        <article class="sermon-card">
            <button class="sermon-image"
                data-video="${index}"
                aria-label="${escapeHTML(sermon.title)} 영상 열기">
                <span class="play-icon">▶</span>
            </button>

            <div class="sermon-info">
                <span class="sermon-category">
                    ${escapeHTML(sermon.category)}
                </span>

                ${sermon.sample
                    ? '<span class="sample-tag">예시</span>'
                    : ''}

                <h3>${escapeHTML(sermon.title)}</h3>
                <span class="sermon-date">
                    ${escapeHTML(sermon.date)}
                </span>
            </div>
        </article>
    `;
}

function renderSermons() {
    const homeSermons = document.getElementById("homeSermons");

    homeSermons.innerHTML = sermons
        .slice(0, 3)
        .map(sermon => sermonCard(
            sermon,
            sermons.indexOf(sermon)
        ))
        .join("");

    updateSermonList();
}

let currentFilter = "전체";

function updateSermonList() {
    const search = document
        .getElementById("sermonSearch")
        .value.trim().toLowerCase();

    const filtered = sermons.filter(sermon => {
        const matchesCategory =
            currentFilter === "전체" ||
            sermon.category === currentFilter;

        const matchesSearch = sermon.title
            .toLowerCase()
            .includes(search);

        return matchesCategory && matchesSearch;
    });

    document.getElementById("allSermons").innerHTML = filtered
        .map(sermon => sermonCard(
            sermon,
            sermons.indexOf(sermon)
        ))
        .join("");

    document.getElementById("sermonEmpty").hidden =
        filtered.length > 0;
}

document.querySelectorAll(".filter").forEach(button => {
    button.addEventListener("click", () => {
        currentFilter = button.dataset.filter;

        document.querySelectorAll(".filter").forEach(item => {
            item.classList.toggle("active", item === button);
        });

        updateSermonList();
    });
});

document.getElementById("sermonSearch")
    .addEventListener("input", updateSermonList);


// ============================================
// YouTube 재생
// ============================================

const videoDialog = document.getElementById("videoDialog");
const videoContainer = document.getElementById("videoContainer");

document.addEventListener("click", event => {
    const button = event.target.closest("[data-video]");

    if (!button) return;

    const index = Number(button.dataset.video);
    const sermon = sermons[index];

    if (!sermon) return;

    document.getElementById("videoTitle").textContent =
        sermon.title;

    const id = getYoutubeId(sermon.youtube);

    if (id) {
        videoContainer.innerHTML = `
            <div class="video-frame">
                <iframe
                    src="https://www.youtube-nocookie.com/embed/${id}"
                    title="${escapeHTML(sermon.title)}"
                    allow="accelerometer; encrypted-media;
                           picture-in-picture; fullscreen"
                    referrerpolicy="strict-origin-when-cross-origin"
                    allowfullscreen>
                </iframe>
            </div>
        `;
    } else {
        videoContainer.innerHTML = `
            <div class="video-placeholder">
                <strong>영상 준비 중</strong>
                <p>
                    실제 설교 영상 주소가 등록되면<br>
                    이곳에서 바로 재생할 수 있습니다.
                </p>
            </div>
        `;
    }

    videoDialog.showModal();
});

function closeVideo() {
    videoDialog.close();
    videoContainer.innerHTML = "";
}

document.getElementById("closeVideo")
    .addEventListener("click", closeVideo);

videoDialog.addEventListener("close", () => {
    videoContainer.innerHTML = "";
});


// ============================================
// 경전 읽기
// ============================================

function renderScripture(type, bookIndex = 0, chapterIndex = 0) {
    const books = scriptures[type];

    if (!books) return;

    if (!Number.isInteger(bookIndex) || !books[bookIndex]) {
        bookIndex = 0;
    }

    const book = books[bookIndex];

    if (
        !Number.isInteger(chapterIndex) ||
        !book.chapters[chapterIndex]
    ) {
        chapterIndex = 0;
    }

    const chapter = book.chapters[chapterIndex];

    const booksEl = document.getElementById(`${type}Books`);
    const chaptersEl = document.getElementById(`${type}Chapters`);
    const textEl = document.getElementById(`${type}Text`);

    // 책 목록
    booksEl.innerHTML = books.map((item, i) => `
        <button class="book-button ${i === bookIndex ? "active" : ""}"
            data-book="${i}"
            data-type="${type}">
            ${escapeHTML(item.title)}
        </button>
    `).join("");

    // 장 목록
    chaptersEl.innerHTML = book.chapters.map((item, i) => `
        <button class="chapter-button ${i === chapterIndex ? "active" : ""}"
            data-chapter="${i}"
            data-book-index="${bookIndex}"
            data-type="${type}">
            ${escapeHTML(item.number)}장
        </button>
    `).join("");

    // 본문
    const versesHTML = chapter.verses.length
        ? chapter.verses.map((verse, i) => `
            <p class="verse">
                <sup class="verse-num">${i + 1}</sup>
                ${escapeHTML(verse)}
            </p>
        `).join("")
        : `
            <div class="placeholder-scripture">
                <p>본문 준비 중</p>
                <p>
                    경전의 확정 원고를 등록하면<br>
                    이곳에 절 번호와 함께 표시됩니다.
                </p>
            </div>
        `;

    textEl.innerHTML = `
        <h3>${escapeHTML(book.title)} ${escapeHTML(chapter.number)}장</h3>
        <div class="scripture-divider">✦</div>
        ${versesHTML}
    `;
}

// 책 또는 장 버튼
document.addEventListener("click", event => {
    const bookButton = event.target.closest("[data-book]");
    const chapterButton = event.target.closest("[data-chapter]");

    if (bookButton) {
        const type = bookButton.dataset.type;
        const bookIndex = Number(bookButton.dataset.book);

        location.hash = `#${type}/${bookIndex}/0`;
        renderScripture(type, bookIndex, 0);
    }

    if (chapterButton) {
        const type = chapterButton.dataset.type;
        const bookIndex = Number(chapterButton.dataset.bookIndex);
        const chapterIndex = Number(chapterButton.dataset.chapter);

        location.hash = `#${type}/${bookIndex}/${chapterIndex}`;
        renderScripture(type, bookIndex, chapterIndex);
    }
});


// ============================================
// 교회 소식
// ============================================

function newsItem(item, expanded = false) {
    return `
        <div class="news-item">
            <span class="news-date">${escapeHTML(item.date)}</span>
            <div>
                <strong>${escapeHTML(item.title)}</strong>
                ${item.sample
                    ? '<span class="sample-tag">예시</span>'
                    : ''}

                ${expanded
                    ? `<p>${escapeHTML(item.body)}</p>`
                    : ''}
            </div>
        </div>
    `;
}

function renderNews() {
    document.getElementById("homeNews").innerHTML =
        newsData.slice(0, 3)
            .map(item => newsItem(item))
            .join("");

    document.getElementById("newsList").innerHTML =
        newsData.map(item => newsItem(item, true)).join("");
}


// ============================================
// 주선자 지원서 (데모)
// ============================================

document.getElementById("applicationForm")
    .addEventListener("submit", event => {
        event.preventDefault();

        document.getElementById("formMessage").textContent =
            "예시 지원서가 확인되었습니다. " +
            "실제 제출 또는 저장은 이루어지지 않았습니다.";

        event.target.reset();
    });


// ============================================
// 초기 실행
// ============================================

renderSermons();
renderNews();
showPage();
