<script lang="ts">
	import Sidebar from "../components/Sidebar.svelte";
	import "../app.css"
	import { page } from '$app/stores';
    import { onMount } from "svelte";
    import Topbar from "../components/Topbar.svelte";
    import Navbar from "../components/Navbar.svelte";

	$: hideLayout=['/login', '/register'].includes($page.url.pathname);
    let isMobile=false;

    onMount(()=>{
        const updateScreen=()=>{
            isMobile=window.innerWidth<=440;
        };
        updateScreen();
        window.addEventListener("resize", updateScreen);
        return()=>window.removeEventListener("resize", updateScreen);
    })

</script>

{#if !hideLayout}
    {#if isMobile}
        <div class="layout">
            <Topbar/>
            <div class="page-contents">
                <slot />
            </div>
            <Navbar/>
        </div>
    {:else}
        <div class="layout">
            <Sidebar/>
            <div class="page-contents">
                <slot />
            </div>
        </div>
    {/if}
{:else}
	<slot/>
{/if}

<style>
	.layout{
		display: flex;
		padding: 16px;
		height: 100vh;
		gap: 16px;
		background-color: var(--bg1);
		color: var(--text1);
	}

	.page-contents{
		border: 2px solid var(--bg3);
        background-color: var(--bg2);
		padding: 16px;
		line-height: 1;
		width: 100%;
		border-radius: 32px;
	}

    @media(max-width: 440px){
        .layout{
            flex-direction: column;
        }

        .page-contents{
            height: 100vh;
        }
    }
</style>
