<template>
  <section class="container">
    <no-ssr>
      <airy-canvas
        ref="airy-canvas"
        :data="airyCanvasData"
        :options="airyCanvasOptions"
        @commit="commit"
      />
    </no-ssr>
    <box class="share-box">
      <airy-button @click="share">
        <font-awesome-icon
          :icon="faShare"
          size="1x"
        />
      </airy-button>
    </box>
    <airy-modal :open.sync="modalOpen" class="share-modal">
      <div v-if="ifShare">
        <div>
          公共链接（测试中，暂无持久化，请勿储存重要信息）
        </div>
        <div>
          <span>
            {{ shareLink }}
          </span>
          <span v-clipboard="copyLink" class="copy-share-link">
            <font-awesome-icon
              v-if="!copyComplete"
              class="copy-btn"
              :icon="faCopy"
              size="1x"
            />
            <font-awesome-icon
              v-if="copyComplete"
              class="copy-success"
              :icon="faCheck"
              size="1x"
            />
          </span>
        </div>
        <br>
        <div>
          该链接最多允许10个用户共同实时绘图
        </div>
        <div>
          <span>
            需要开放更多人数，请给我们发邮件
            <a href="mailto:info@aoiwork.com">
              info@aoiwork.com
            </a>
          </span>
        </div>
      </div>
      <div v-if="!ifShare">
        <font-awesome-icon
          :icon="faSpinner"
          class="loading-sharelink"
          size="4x"
        />
      </div>
    </airy-modal>
  </section>
</template>

<script>
import io from 'socket.io-client'
import Box from '@/components/Box'
import AiryButton from '@/components/AiryButton'
import AiryModal from '@/components/AiryModal'
import { faShare, faCopy, faCheck, faSpinner } from '@fortawesome/free-solid-svg-icons'

export default {
  components: {
    Box,
    AiryButton,
    AiryModal
  },
  data() {
    return {
      airyCanvasData: [],
      airyCanvasOptions: {
        fluid: true
      },
      modalOpen: false,
      shareLink: '',
      copyComplete: false,
      ifShare: false,
      shareKey: ''
    }
  },
  computed: {
    faShare() {
      return faShare
    },
    faCopy() {
      return faCopy
    },
    faCheck() {
      return faCheck
    },
    faSpinner() {
      return faSpinner
    }
  },
  mounted() {
    const hash = location.hash.match(/^#(.*)$/)
    if (hash) {
      this.shareKey = hash[1]
      this.shareLink = location.href
    }

    if (this.shareKey) {
      // connect to exist board
      this.initSocket(this.shareKey)
    }
  },
  methods: {
    commit(element) {
      if (this.socket) {
        this.socket.emit('airy-update', element)
      }
    },
    async share() {
      this.modalOpen = true
      if (!location.hash) {
        const data = await this.$axios.$post('/board', {
          history: this.$refs['airy-canvas'].getHistory()
        })
        this.shareKey = data.key
        location.hash = `#${data.key}`
        this.shareLink = location.href
        this.initSocket(this.shareKey)
        this.ifShare = true
      } else {
        this.ifShare = true
      }
    },
    copyLink() {
      this.copyComplete = true
      setTimeout(() => {
        this.copyComplete = false
      }, 1000)
      return this.shareLink
    },
    initSocket(key = '') {
      const socket = io(`${location.protocol}//${location.host}`)
      this.socket = socket
      socket.on('connect', () => {
        console.log('socket connect')
        socket.emit('airy-hello', {
          key
        })
        socket.on('airy-hello', (data) => {
          // TODO: message notice
          if (data.status) {
            // connect to board success
            console.log('connect to board success')
          } else {
            // connect fail
            console.log('connect fail')
          }
        })
        socket.on('airy-history', (data) => {
          this.airyCanvasData = data
        })
        socket.on('airy-update', (data) => {
          this.$refs['airy-canvas'].updateNode(data)
        })
      })
    }
  }
}
</script>

<style scoped>
.container {
  height: 100vh;
}
.share-box {
  position: absolute;
  top: 20px;
  right: 20px;
}
.share-modal {
  text-align: center;
}
.copy-share-link {
  cursor: pointer;
}
.copy-btn, .loading-sharelink {
  color: #666;
}
.copy-success {
  color: #4caf50;
}
.loading-sharelink {
  margin-top: 50px;
  animation: rotate 1.5s linear infinite;
}
@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
