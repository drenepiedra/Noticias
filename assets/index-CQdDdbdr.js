(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))n(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const i of s.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&n(i)}).observe(document,{childList:!0,subtree:!0});function e(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function n(r){if(r.ep)return;r.ep=!0;const s=e(r);fetch(r.href,s)}})();const a={API_KEY:"a486518e003ac39f35574755d3815a7b",API_BASE_URL:"https://api.mediastack.com/v1/news",ARTICLES_LIMIT:20,KEYWORDS:["technology"]};class u{constructor(){this.newsGrid=document.getElementById("news-grid"),this.filterButtons=document.querySelectorAll(".filter-btn"),this.currentFilter="all",this.articles=[],this.isLoading=!1,this.init()}init(){this.setupEventListeners(),this.fetchNews()}setupEventListeners(){this.filterButtons.forEach(t=>{t.addEventListener("click",()=>{const e=t.dataset.category;this.updateFilter(e,t)})})}updateFilter(t,e){this.currentFilter=t,this.filterButtons.forEach(n=>n.classList.remove("active")),e.classList.add("active"),this.renderArticles()}async fetchNews(){this.isLoading=!0,this.renderSkeletons();try{const t=a.KEYWORDS.join(" OR "),e=`${a.API_BASE_URL}?access_key=${a.API_KEY}&keywords=${encodeURIComponent(t)}&limit=${a.ARTICLES_LIMIT}&languages=en`,r=await(await fetch(e)).json();if(r.error)throw new Error(r.error.message||"API Error");const s=r.data||r.articles||[];if(s.length===0)throw new Error("No articles found for your search criteria");this.articles=s,this.isLoading=!1,this.renderArticles()}catch(t){console.error("Error fetching news:",t),this.renderError(t.message),this.isLoading=!1}}getCategoryFromContent(t){const e=(t.title+" "+t.description).toLowerCase();return e.includes("laravel")?"laravel":e.includes("javascript")||e.includes("js")?"javascript":e.includes("ai")||e.includes("intelligence")||e.includes("gpt")?"ai":"general"}getSourceColor(t){const e=["##E8E4E6","##E8E4E6","##E8E4E6","##E8E4E6","##E8E4E6","##E8E4E6","##E8E4E6","##E8E4E6","##E8E4E6","##E8E4E6","##E8E4E6","##E8E4E6"];let n=0;const r=t||"news";for(let s=0;s<r.length;s++)n=r.charCodeAt(s)+((n<<5)-n);return e[Math.abs(n)%e.length]}renderSkeletons(){this.newsGrid.innerHTML="";for(let t=0;t<6;t++){const e=document.createElement("div");e.className="skeleton-card skeleton",this.newsGrid.appendChild(e)}}renderError(t){this.newsGrid.innerHTML=`
            <div class="error-container">
                <h2>Ouch! Something went wrong</h2>
                <p>${t}</p>
                <button class="retry-btn" onclick="location.reload()">Try Again</button>
            </div>
        `}renderArticles(){const t=this.currentFilter==="all"?this.articles:this.articles.filter(e=>this.getCategoryFromContent(e)===this.currentFilter);if(t.length===0&&!this.isLoading){this.newsGrid.innerHTML=`
                <div class="error-container">
                    <h2>No articles found</h2>
                    <p>Try refreshing or selecting a different category.</p>
                </div>
            `;return}this.newsGrid.innerHTML="",t.forEach((e,n)=>{if(n>0&&n%5===0){const c=document.createElement("div");c.className="in-grid-ad",c.innerHTML="<span>Sponsor Advertisement Showcase</span>",this.newsGrid.appendChild(c)}const r=this.getCategoryFromContent(e),s=n%2!==0,i=e.source||"News Source",d=this.getSourceColor(i),h=i.charAt(0).toUpperCase(),o=document.createElement("article");o.className=`news-card ${s?"dark-card":""}`,o.innerHTML=`
                <div class="card-image-placeholder" style="background: ${d};">
                    <div class="placeholder-content">
                        <span class="source-letter">${h}</span>
                        <span class="source-name-small">${i}</span>
                    </div>
                </div>
                <div class="card-content">
                    <span class="category-badge badge-${r}">${r}</span>
                    <h3 class="card-title">${e.title}</h3>
                    <p class="card-description">${e.description||"Click to read the full story on the original website."}</p>
                    <div class="card-footer">
                        <div class="author-info">
                            <span>${e.author||i}</span>
                        </div>
                        <span class="read-more">Read Story &rarr;</span>
                    </div>
                </div>
            `,o.addEventListener("click",()=>{window.open(e.url,"_blank")}),this.newsGrid.appendChild(o)})}}document.addEventListener("DOMContentLoaded",()=>{new u});
