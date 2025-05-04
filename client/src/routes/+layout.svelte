<script lang="ts">
	import Navbar from "../components/Navbar.svelte";
	import "../app.css"
	import { page } from '$app/stores';

	$: hideLayout = ['/login', '/register'].includes($page.url.pathname);
</script>

{#if !hideLayout}
	<div class="layout">
		<Navbar />
		<div class="page-contents">
			<slot />
		</div>
	</div>
{:else}
	<slot />
{/if}

<style>
	.layout {
		display: flex;
		padding: 16px;
		height: 100vh;
		gap: 16px;
		background-color: #000000;
		color: white;
	}

	.page-contents {
		border: 2px solid #2A2A2A;
        background-color: #111111;
		padding: 16px;
		line-height: 1;
		width: 100%;
		border-radius: 32px;
	}

    @media(max-width: 440px){
        .layout{
            flex-direction: column-reverse;
        }

        .page-contents{
            height: 100vh;
        }
    }
</style>
