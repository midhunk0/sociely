<script lang="ts">
    import { logoutUser } from "$lib/api";
    import { goto } from "$app/navigation";

    
    async function handleLogout() {
        const result=await logoutUser();
        if(result.success) {
            goto("/login");
        } else {
            alert(result.message);
        }
    }
</script>

<div class="settings">
    <h1>Settings</h1>
    <button type="button" class="logout" on:click={handleLogout}>Logout</button>
</div>

<style>
    .settings{
        display: flex;
        flex-direction: column;
        gap: 16px
    }

    .logout{
       padding: 12px 24px;
       font-size: 16px; 
       border-radius: 8px;
       cursor: pointer;
       border: none;
       width: fit-content;
       background-color: var(--text2);
       color: var(--bg2);
    }

    .logout:hover{
        background-color: var(--orange);
        color: var(--white);
    }
</style>