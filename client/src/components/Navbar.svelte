<script lang="ts">
    import { Motion } from "svelte-motion";
    import { page } from "$app/stores";
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";

    let top = 0;
    let width = 0;
    let opacity = 0;
    let hoverStates: Record<string, boolean>={};
    let isMobile=false;
    onMount(()=>{
        const updateScreen=()=>{
            isMobile=window.innerWidth<=440;
        };
        updateScreen();
        window.addEventListener("resize", updateScreen);
        return ()=>window.removeEventListener("resize", updateScreen);
    })

    const navItems=[
        { path: "/add", icon: "add" },
        { path: "/home", icon: "home" },
        { path: "/search", icon: "search" },
        { path: "/chat", icon: "messages" },
        { path: "/saved", icon: "like" }
    ]

    let positionMotion = (node: HTMLElement) => {
        let refNode = () => {
            let mint = node.getBoundingClientRect();
            top = node.offsetTop;
            width = mint.width;
            opacity = 1;
        };
        node.addEventListener("mouseenter", refNode);
        return {
            destroy() {
                node.removeEventListener("mouseenter", refNode);
            },
        };
    };
    $: currentPath=$page.url.pathname;

    function getIconSrc(item: { path: string, icon: string }){
        const isActive=currentPath===item.path;
        const hovered=hoverStates[item.path] || false;

        if(isActive && hovered) return `/${item.icon}-active-hover.png`;
        if(isActive) return `/${item.icon}-active-hover.png`;
        if(hovered) return `/${item.icon}.png`;
        return `/${item.icon}.png`;
    }
</script>

<nav class="navbar">
    <button class="logo" on:click={()=>goto("/home")}>
        <img src="/logo.png" alt="logo" class="icon">
    </button>
    <ul
        class="buttons"
        on:mouseleave={() => {
            width = width;
            top = top;  
            opacity = 0;
        }}
    >
        {#each navItems as item}
        <li>
            <button type="button" use:positionMotion on:click={()=>goto(item.path)} on:mouseenter={()=>hoverStates[item.path]=true} on:mouseleave={()=>hoverStates[item.path]=false}>
                <img
                    src={getIconSrc(item)}
                    alt={item.icon}
                    class="icon"
                />
                {#if hoverStates[item.path]}
                    <div class="tooltip">
                        <p>{item.icon}</p>
                    </div>
                {/if}
            </button>
        </li>
        {/each}
        {#if !isMobile}
        <Motion
            animate={{
                top: top,
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
        {/if}
    </ul>
    <button 
        class="settings" 
        on:mouseenter={()=>hoverStates["/settings"]=true} 
        on:mouseleave={()=>hoverStates["/settings"]=false}
        on:click={()=>goto("/settings")}
    >
        <img src={getIconSrc({ path: "/settings", icon: "settings"})} alt="settings" class="icon">
        {#if hoverStates["/settings"]}
            <div class="tooltip">
                <p>settings</p>
            </div>
        {/if}
    </button>
</nav>

<style>
    .navbar{
        display: flex;
        flex-direction: column;
        align-items: center;
        height: calc(100vh - 32px);
        justify-content: space-between;
        width: fit-content;
    }

    .tooltip{
        position: absolute;
        left: 56px;
        top: 50%;
        transform: translateY(-50%);
        padding: 12px 24px;
        background-color: #E05E35;
        border-radius: 24px;
        color: white;
    }

    .tooltip p{
        text-transform: capitalize;
    }


    .logo, .settings{
        border: none;
        outline: none;
        background-color: #E05E35;
        border: 2px solid #2A2A2A;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 12px;
        cursor: pointer;
        color: white;
    }

    .settings{
        background-color: #111111;
        position: relative;
    }
    
    .buttons{
        display: flex;
        flex-direction: column;
        gap: 8px;
        border-radius: 32px;
        background-color: #111111;
        border: 2px solid #2A2A2A;
        list-style: none;
        padding: 0;
        margin: 0;
    }


    .buttons button{
        display: flex;
        border-radius: 32px;
        border: none;
        background-color: #111111;
        padding: 12px;
        cursor: pointer;
        position: relative;
    }

    .buttons button img{
        position: relative;
        z-index: 2;
    }

    .settings:hover{
        background-color: white;
    }

    .indicator {
        position: absolute;
        z-index: 0;
        height: 28px;
        background-color: white;
        border-radius: 9999px;
        cursor: pointer;
        pointer-events: none;
        height: 48px;
    }

    @media(max-width: 440px){
        .navbar, .buttons{
            flex-direction: row;
        }

        .navbar{
            gap: 16px;
            height: fit-content;
            width: 100%;
            justify-content: space-between;
        }

        .indicator, .tooltip{
            display: none;
        }

        .logo{
            display: none;
        }
    }
</style>
