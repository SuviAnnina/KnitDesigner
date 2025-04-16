   <template>
    <div
      class="fixed inset-0 flex items-center justify-center z-50"
      style="background-color: rgba(0, 0, 0, 0.2); backdrop-filter: blur(2px);">
      <div class="bg-white p-6 rounded-lg shadow-xl text-center space-y-4 w-80">
  
        <p class="text-lg font-medium">{{ message }}</p>
  
        <div class="flex justify-center space-x-4">
          <button
            v-if="buttons.includes('yes')"
            @click="$emit('confirm')"
            class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-800">
            Yes
          </button>
  
          <button
            @click="$emit('cancel')"
            class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
            Cancel
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      message: {
        type: String,
        required: true
      },
      buttons: {
        type: Array,
        default: () => ['cancel']
      }
    }
  }
  </script>
  