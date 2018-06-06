(() => {
  const axios = window.axios;

  Vue.component('click-event-item', {
    props: ['item'],
    template: `
      <tr>
        <td>{{ item.url }}</td>
        <td>{{ item.element_id }}</td>
        <td>{{ item.element_classname }}</td>
        <td>{{ appUtils.getTimeMinuteSecond(item.time) }}</td>
        <td>
          <a v-bind:href='"/receptor" + item.url'>
          {{ appUtils.getApproximateTime(item.story.time) }} on {{item.url}}
          </a>
        </td>
        <td><a v-bind:href='"/receptor" + item.url'>review in story</a></td>
      </tr>
    `
  })

  Vue.component('story-item', {
    props: ['item'],
    template: `
      <tr>
        <td>{{ item.url }}</td>
        <td>{{ appUtils.getApproximateTime(item.time) }}</td>
        <td><a v-bind:href='"/receptor" + item.url'>review in story</a></td>
      </tr>
    `
  })

  const Event = {
    template: `
      <section class='app-body'>
        <table class='list-table'>
        <tbody>
            <tr>
              <th>page</th>
              <th>id</th>
              <th>classname</th>
              <th>time</th>
              <th>story</th>
              <th>operation</th>
            </tr>
            <tr
              is='click-event-item'
              v-for="item in this.clickEvents"
              v-bind:item="item"
              v-bind:key="item.id">
            </tr>
        </tbody>
      </table>
      <center class='data-bottom'>
        <a
          class='load-more-btn'
          v-on:click='loadMore'
          v-if='!this.allLoaded'
          href="javascript: void(0)"
        >load more</a>
        <span
          v-if='this.allLoaded'
        >All events are loaded.</span>
      </center>
      </section>
    `,
    data() {
      return {
        page: 1,
        PAGE_SIZE: 20,
        clickEvents: [],
        allLoaded: false
      }
    },
    methods: {

      loadMore: function() {
        this.get();
      },

      get: async function() {
        const { page, PAGE_SIZE } = this;
        const result = await axios.get(`/api/events?page=${page}&pageSize=${PAGE_SIZE}`);
        this.clickEvents = this.clickEvents.concat(result.data);

        if (result.data.length < PAGE_SIZE) {
          this.allLoaded = true
        } else {
          this.page = this.page + 1;
        }
      }

    },
    mounted: async function() {
      this.get();
    }
  }

  const Story = {
    template: `
      <section class='app-body'>
        <table class='list-table'>
        <tbody>
            <tr>
              <th>page</th>
              <th>time</th>
              <th>operation</th>
            </tr>
            <tr
              is='story-item'
              v-for="item in this.clickEvents"
              v-bind:item="item"
              v-bind:key="item.id">
            </tr>
        </tbody>
      </table>
      <center class='data-bottom'>
        <a
          class='load-more-btn'
          v-on:click='loadMore'
          v-if='!this.allLoaded'
          href="javascript: void(0)"
        >load more</a>
        <span
          v-if='this.allLoaded'
        >All events are loaded.</span>
      </center>
      </section>
    `,
    data() {
      return {
        page: 1,
        PAGE_SIZE: 20,
        clickEvents: [],
        allLoaded: false
      }
    },
    methods: {

      loadMore: function() {
        this.get();
      },

      get: async function() {
        const { page, PAGE_SIZE } = this;
        const result = await axios.get(`/api/stories?page=${page}&pageSize=${PAGE_SIZE}`);
        this.clickEvents = this.clickEvents.concat(result.data);

        if (result.data.length < PAGE_SIZE) {
          this.allLoaded = true
        } else {
          this.page = this.page + 1;
        }
      }

    },
    mounted: async function() {
      this.get();
    }
  }


  const routes = [
    { path: '/', component: Event },
    { path: '/event', component: Event },
    { path: '/story', component: Story }
  ]

  const router = new VueRouter({ routes });

  const app = new Vue({
    router
  }).$mount('#app');
})()