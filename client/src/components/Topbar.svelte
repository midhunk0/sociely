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

<nav class="topbar">
    <button class="logo" on:click={()=>goto("/home")}>
        <h2>app*</h2>
    </button>
    <div class="buttons">
        <button class="logout" on:click={()=>handleLogout()}>
            <h2>logout</h2>
        </button>
    </div>
</nav>

<style>
    .topbar{
        display: flex;
        background-color: red;
        padding: 16px;
        align-items: center;
        justify-content: space-between;
    }

    .logo, .logout{
        border: none;
        outline: none;
        background-color: red;
        cursor: pointer;
        color: white;
    }
</style>