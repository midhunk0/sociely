<script lang="ts">
  import { fetchProfile, fetchUser } from "$lib/api";
  import { onMount } from "svelte";

    let user: any, followers: any[]=[], followings: any[]=[];

    async function handleFetchProfile(){
        const result=await fetchProfile();
        if(result){    
            user=result.user;
        } 
        else{
            console.log(result.message);
        }
    }

    async function handleFetchFollowers(){
        if(!user?.followers) return;
        const result=await Promise.all(
            user.followers.map((follower: any)=>fetchUser(follower.userId))
        );
        followers=result;
    }

    async function handleFetchFollowings(){
        if(!user?.followings) return;
        const result=await Promise.all(
            user.followings.map((following: any)=>fetchUser(following.userId))
        );
        followings=result;
    }

    onMount(async ()=>{
        await handleFetchProfile();
        await handleFetchFollowers();
        await handleFetchFollowings();
    })
</script>

<div class="page">
    {#if user}
        <h1>{user.username}</h1>
    {/if}
</div>
