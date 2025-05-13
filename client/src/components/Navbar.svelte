<script lang="ts">
    import { Motion } from "svelte-motion";
    import { page } from "$app/stores";
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";

    let theme: string, hovered=false;

    onMount(()=>{
        theme=localStorage.getItem("theme") || "dark";
        setTheme();
    })

    function toggle(){
        theme=theme==="dark" ? "light" : "dark";
        setTheme();
    }

    function setTheme(){
        if(theme==="light"){
            document.body.classList.add("light-mode");
            document.documentElement.setAttribute("data-theme", "light");
        }
        else{
            document.body.classList.remove("light-mode");
            document.documentElement.setAttribute("data-theme", "dark");
        }
        localStorage.setItem("theme", theme);
    }

    let left=0, width=0, opacity=0, hoverStates: Record<string, boolean>={};

    const sidebarItems=[
        { path: "/home", icon: "home" },
        { path: "/search", icon: "search" },
        { path: "/add", icon: "add" },
        { path: "/chat", icon: "messages" },
        { path: "/profile", icon: "profile" }
    ]

    let positionMotion=(node: HTMLElement)=>{
        let refNode=()=>{
            let mint=node.getBoundingClientRect();
            left=mint.left;
            width=mint.width;
            opacity=1;
        };
        node.addEventListener("mouseenter", refNode);
        return{
            destroy(){
                node.removeEventListener("mouseenter", refNode);
            },
        };
    };
    $:currentPath=$page.url.pathname;

    function getIconSrc(item: { path: string, icon: string }){
        const isActive=currentPath===item.path;
        const hovered=hoverStates[item.path] || false;

        if(isActive && hovered) return `/${item.icon}-active.png`;
        if(isActive) return `/${item.icon}-active.png`;
        if(hovered) return `/${item.icon}.png`;
        return `/${item.icon}.png`;
    }
</script>

<nav class="navbar">
    <ul
        class="buttons"
        on:mouseleave={()=>{
            width=width;
            left=left;  
            opacity=0;
        }}
    >
        {#each sidebarItems as item}
            <li>
                <button type="button" 
                    use:positionMotion 
                    on:click={()=>goto(item.path)} 
                    on:mouseenter={()=>hoverStates[item.path]=true} 
                    on:mouseleave={()=>hoverStates[item.path]=false}
                >
                    <img
                        src={getIconSrc(item)}
                        alt={item.icon}
                        class="icon"
                    />
                    {#if hoverStates[item.path]}
                        <p class="tooltip">{item.icon}</p>
                    {/if}
                </button>
            </li>
        {/each}
        <li>
            <button 
                on:click={toggle} 
                class="button"
                use:positionMotion 
                on:mouseenter={()=>hovered=true}
                on:mouseleave={()=>hovered=false}
            >
                {#if theme==="light"}
                    <img 
                        src={hovered ? "/light-active.png" : "/light.png" }
                        alt="theme"
                        class="icon"
                    />
                {:else}
                    <img 
                        src={hovered ? "/dark-active.png" : "/dark.png" }
                        alt="theme"
                        class="icon"
                    />
                {/if}
            </button>
        </li>
        <Motion
            animate={{
                left: left,
                width: width,
                opacity: opacity,
            }}
            transition={{
                type: "spring",
                stiffness: 400,
                damping: 30,
            }}
            let:motion
        >
            <li
                use:motion
                class="indicator"
            ></li>
        </Motion>
    </ul>
</nav>

<style>

    .navbar{
        display: flex;
        justify-content: center;
    }

    .buttons{
        display: flex;
        border-radius: 32px;
        background-color: var(--bg2);
        border: 2px solid var(--bg3);
        list-style: none;
        gap: 8px;
    }

    .buttons button{
        display: flex;
        border-radius: 50%;
        border: none;
        background-color: var(--bg2);
        padding: 12px;
        cursor: pointer;
        position: relative;
    }

    .buttons button img{
        z-index: 1;
    }

    .tooltip{
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        bottom: calc(100% + 8px);
        padding: 8px 16px;
        background-color: var(--orange);
        border-radius: 24px;
        color: var(--white);
        text-transform: capitalize;
    }

    .indicator{
        position: absolute;
        background-color: var(--text1);
        border-radius: 50%;
        cursor: pointer;
        pointer-events: none;
        height: 48px;
    }
</style>