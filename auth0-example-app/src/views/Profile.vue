<template>
  <div>
      <h1>
        Profile
      </h1>
      <div>
        <img :src="$auth.user.picture">
        <h2>
          {{ $auth.user.name }}
        </h2>
        <p>
          {{ $auth.user.email }}
        </p>
        <div>
          <pre>{{ JSON.stringify($auth.user, null, 2) }}</pre>
        </div>
      </div>
      <h1>
        External API Invoke
      </h1>
      <p>
        Result: {{ apiMesseage }}
      </p>
      <ul
        style="margin: 0 auto; width: 300px"
      >
        <li
          v-for="endpoint in apiEndpointList"
          :key="endpoint"
          style="float:left"
        >
          {{ endpoint }}
          <a
            @click="apiInvoke(endpoint)"
            style="cursor:pointer; color:red; margin-left: 100px"
          >
            Invoke
          </a>
        </li>
      </ul>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'Profile',
  data () {
    return {
      apiEndpointList: [
        'external',
        'external_permission'
      ],
      apiMesseage: ''
    }
  },
  methods: {
    async apiInvoke (endpoint) {
      // Get the access token from the auth wrapper
      const token = await this.$auth.getTokenSilently()
      try {
        // Use Axios to make a call to the API
        const { data } = await axios.get(`/api/v2/${endpoint}`, {
          headers: {
            Authorization: `Bearer ${token}`    // send the access token through the 'Authorization' header
          }
        })
  
        this.apiMesseage = data.msg
      } catch (e) {
        console.error(e)
        this.apiMesseage = e
      }
    }
  }
}
</script>

<style>
</style>
