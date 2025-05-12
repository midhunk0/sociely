<script lang="ts">
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";

    $:currentPath=$page.url.pathname;
    let hover=false;

    function getIconSrc(item: { path: string, icon: string }){
        const isActive=currentPath===item.path;
        const hovered=hover;

        if(isActive && hovered) return `/${item.icon}-active-hover.png`;
        if(isActive) return `/${item.icon}-active-hover.png`;
        if(hovered) return `/${item.icon}.png`;
        return `/${item.icon}.png`;
    }
</script>

<div class="topbar">
    <div class="topbar-heading">
        <button class="logo" on:click={()=>goto("/home")}>
            <img src="/logo.png" alt="logo" class="icon">
        </button>
        <h2>sociely</h2>
    </div>

    <button 
        class="settings" 
        on:mouseenter={()=>hover=true}
        on:mouseleave={()=>hover=false}
        on:click={()=>goto("/settings")}
    >
        <img 
            src={getIconSrc({ path: "/settings", icon: "settings"})} 
            alt="settings" 
            class="icon"
        >
        {#if hover}
            <p class="tooltip">settings</p>
        {/if}
    </button>
</div>

<style>
    .topbar{
        display: flex;
        justify-content: space-between;
    }

    .topbar-heading{
        display: flex;
        gap: 8px;
        align-items: center;
    }

    .logo, .settings{
        border: 2px solid var(--bg3);
        border-radius: 50%;
        display: flex;
        padding: 12px;
        cursor: pointer;
    }

    .logo{
        background-color: var(--orange);
    }

    .settings{
        background-color: var(--bg2);
        position: relative;
    }

    .settings:hover{
        background-color: var(--text1);
    }

    .tooltip{
        position: absolute;
        right: -2px;
        top: calc(100% + 8px);
        padding: 8px 16px;
        background-color: var(--orange);
        border-radius: 24px;
        color: var(--white);
        text-transform: capitalize;
    }
</style>