<script setup lang="ts">
import avatar1 from '@images/avatars/avatar-1.png'

const mode = ref<'rgb'>('rgb')
const modes = ref (['hsla', 'rgba', 'hexa'])
const color = ref('#ff00ff')
</script>

<template>
  <VRow>
    <!-- 👉 VToolbar   -->
    <VCol cols="12">
      <VCard title="VToolbar density">
        <VCardText>
          <VRow>
            <VCol cols="12">
              <p>VToolbar density</p>
              <VToolbar :elevation="7">
                <VAppBarNavIcon icon="ri-search-line" />
                <VToolbarTitle>VToolBar default density</VToolbarTitle>
                <VSpacer />

                <VBtn icon>
                  <VIcon icon="ri-more-2-line" />
                </VBtn>
              </VToolbar>
            </VCol>

            <!-- vtoolbar comfortable density -->
            <VCol cols="12">
              <VToolbar density="comfortable">
                <VAppBarNavIcon />

                <VToolbarTitle>Toolbar comfortable density</VToolbarTitle>

                <VSpacer />

                <VBtn icon>
                  <VIcon icon="ri-more-2-line" />
                </VBtn>
              </VToolbar>
            </VCol>

            <!-- vtoolbar compact density -->
            <VCol cols="12">
              <VToolbar density="compact">
                <VAppBarNavIcon />

                <VToolbarTitle>VToolbar compact density</VToolbarTitle>

                <VSpacer />

                <VBtn icon>
                  <VIcon icon="ri-more-2-line" />
                </VBtn>
              </VToolbar>
            </VCol>

            <!-- VToolbar density prominent prop -->
            <VCol cols="12">
              <VToolbar density="prominent">
                <VAppBarNavIcon />

                <VToolbarTitle>VToolbar prominent Prop</VToolbarTitle>

                <VSpacer />

                <VToolbarItems
                  variant="tonal"
                  color="primary"
                >
                  <VBtn icon>
                    <VIcon icon="ri-heart-fill" />
                  </VBtn>

                  <VBtn icon>
                    <VIcon icon="ri-more-2-line" />
                  </VBtn>
                </VToolbarItems>
              </VToolbar>
            </VCol>

            <!-- VToolbar Extended prop -->
            <VCol cols="12">
              <p>With <code>extnesion-height</code> prop, we can implicitely provide the extnesion-height.</p>
              <VToolbar
                extended
                theme="transperent"
              >
                <VAppBarNavIcon />

                <VToolbarTitle>VToolbar extended Prop</VToolbarTitle>

                <VSpacer />

                <VBtn icon>
                  <VIcon icon="ri-heart-fill" />
                </VBtn>

                <VBtn icon>
                  <VIcon icon="ri-more-2-line" />
                </VBtn>
              </VToolbar>
            </VCol>

            <!-- VToolbar height prop -->
            <VCol cols="12">
              <p>With <code>height</code> prop, we can implicitely give the height of toolbar component. This will override heights by density prop.below example is height set to 50px.</p>
              <VToolbar height="50">
                <VAppBarNavIcon />

                <VToolbarTitle>VToolbar height Prop</VToolbarTitle>

                <VSpacer />

                <VBtn icon>
                  <VIcon icon="ri-heart-fill" />
                </VBtn>

                <VBtn icon>
                  <VIcon icon="ri-more-2-line" />
                </VBtn>
              </VToolbar>
            </VCol>
          </VRow>
        </VCardText>
      </VCard>
    </VCol>

    <!-- 👉 Breadcrumbs  -->
    <VCol cols="12">
      <VCard title="BradCrumbs">
        <VCardText>
          <h3>Breadcrumbs density</h3>
          <VBreadcrumbs :items="['Foo', 'Bar', 'Fizz']" />

          <VBreadcrumbs
            :items="['Foo', 'Bar', 'Fizz']"
            density="comfortable"
          />

          <VBreadcrumbs
            :items="['Foo', 'Bar', 'Fizz']"
            density="compact"
          />
        </VCardText>
      </VCard>
    </VCol>

    <!-- 👉 corousel  -->
    <VCol cols="12">
      <VCard title="carousel">
        <VCardText>
          <VRow>
            <VCol
              cols="12"
              sm="6"
            >
              <VCarousel
                delimiter-icon="ri-alert-line"
                color="primary"
                direction="vertical"
                hide-delimiter-background
                next-icon="ri-arrow-down-s-line"
                prev-icon="ri-arrow-up-s-line"
              >
                <VCarouselItem
                  src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"
                  cover
                />

                <VCarouselItem
                  src="https://cdn.vuetifyjs.com/images/cards/hotel.jpg"
                  cover
                />

                <VCarouselItem
                  src="https://cdn.vuetifyjs.com/images/cards/sunshine.jpg"
                  cover
                />
              </VCarousel>
            </VCol>

            <VCol
              cols="12"
              sm="6"
            >
              <p><code>height</code> prop in corousel gives flexibiltiy to change the height</p>
              <VCarousel height="400px">
                <VCarouselItem
                  src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"
                  cover
                />

                <VCarouselItem
                  src="https://cdn.vuetifyjs.com/images/cards/hotel.jpg"
                  cover
                />

                <VCarouselItem
                  src="https://cdn.vuetifyjs.com/images/cards/sunshine.jpg"
                  cover
                />
              </VCarousel>
            </VCol>
          </VRow>
        </VCardText>
      </VCard>
    </VCol>

    <!-- 👉 Banners  -->
    <VCol cols="12">
      <VCard title="banners">
        <VCardText>
          <VRow>
            <!-- Banner Density -->
            <VCol
              cols="12"
              sm="6"
            >
              <p>VBanner Density</p>
              <VBanner
                lines="two"
                icon="ri-checkbox-circle-line"
                color="primary"
                class="my-4"
                density="default"
              >
                <VBannerText>Banner with one line of text Banner with one line of text Banner with one line of text Banner with one line of text Banner with one line of text Banner with one line of text Banner with one line of text Banner with one line of text Banner with one line of text Banner with one line of text Banner with one line of text </VBannerText>
                <template #actions>
                  <VBtn>Action</VBtn>
                  <VBtn>Dismiss</VBtn>
                </template>
              </VBanner>

              <VBanner
                lines="two"
                icon="ri-alert-line"
                color="error"
                class="my-4"
                density="comfortable"
              >
                <VBannerText>Banner with one line of text Banner with one line of text Banner with one line of text Banner with one line of text Banner with one line of text Banner with one line of text Banner with one line of text Banner with one line of text Banner with one line of text Banner with one line of text Banner with one line of text </VBannerText>
                <template #actions>
                  <VBtn>Action</VBtn>
                  <VBtn>Dismiss</VBtn>
                </template>
              </VBanner>

              <VBanner
                lines="two"
                icon="ri-lock-line"
                color="warning"
                class="my-4"
                density="compact"
              >
                <VBannerText>Banner with one line of text Banner with one line of text Banner with one line of text Banner with one line of text Banner with one line of text Banner with one line of text Banner with one line of text Banner with one line of text Banner with one line of text Banner with one line of text Banner with one line of text </VBannerText>
                <template #actions>
                  <VBtn>Action</VBtn>
                  <VBtn>Dismiss</VBtn>
                </template>
              </VBanner>
            </VCol>

            <VCol
              cols="12"
              sm="6"
            >
              <!-- Banner Hight & width -->
              <p>VBanner Height & width</p>
              <VBanner
                lines="two"
                icon="ri-checkbox-circle-line"
                color="primary"
                class="my-4"
                height="140"
                width="300"
                theme="dark"
              >
                <VBannerText>Banner with one line of text Banner with one line of text Banner with one line of text Banner with one line of text Banner with one line of text Banner with one line of text Banner with one line of text Banner with one line of text Banner with one line of text Banner with one line of text Banner with one line of text </VBannerText>
                <template #actions>
                  <VBtn>Action</VBtn>
                  <VBtn>Dismiss</VBtn>
                </template>
              </VBanner>

              <!-- Banner Actions Density -->
              <p>Banner Actions Density</p>
              <VBanner
                lines="two"
                icon="ri-checkbox-circle-line"
                color="primary"
                class="my-4"
                theme="dark"
              >
                <VBannerText>Banner with one line of text Banner with one line of text Banner with one line of text Banner with one line of text Banner with one line of text Banner with one line of text Banner with one line of text Banner with one line of text Banner with one line of text Banner with one line of text Banner with one line of text </VBannerText>
                <VBannerActions density="compact">
                  <VBtn>Action</VBtn>
                  <VBtn>Dismiss</VBtn>
                </VBannerActions>
              </VBanner>
            </VCol>
          </VRow>
        </VCardText>
      </VCard>
    </VCol>

    <!-- 👉 VTimeline  -->
    <VCol cols="12">
      <VCard title="Timeline">
        <VCardText>
          <VRow>
            <!-- timeline Density -->
            <VCol cols="12">
              <h3>timeline prop <code>density</code> is set to default</h3>
              <VTimeline
                direction="vertical"
                line-color="success"
                line-thickness="5"
                density="default"
                truncate-line="both"
              >
                <VTimelineItem>
                  <template #opposite>
                    Opposite Content
                  </template>
                  <VCard
                    elevation="7"
                    title="Content Title"
                  >
                    <VCardText> Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum molestias nam,!</VCardText>
                  </VCard>
                </VTimelineItem>

                <VTimelineItem>
                  <template #opposite>
                    Opposite Content
                  </template>
                  <VCard
                    elevation="7"
                    title="Content Title"
                  >
                    <VCardText> Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum molestias nam,!</VCardText>
                  </VCard>
                </VTimelineItem>

                <VTimelineItem>
                  <template #icon>
                    <VAvatar :image="avatar1" />
                  </template>
                  <template #opposite>
                    Opposite Content
                  </template>

                  <VCard
                    elevation="7"
                    title="Content Title"
                  >
                    <VCardText> Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum molestias nam,!</VCardText>
                  </VCard>
                </VTimelineItem>

                <VTimelineItem>
                  <template #opposite>
                    <div class="text-success">
                      Opposite Content
                    </div>
                  </template>
                  <VCard
                    elevation="7"
                    title="Content Title"
                  >
                    <VCardText> Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum molestias nam,!</VCardText>
                  </VCard>
                </VTimelineItem>
              </VTimeline>
            </VCol>

            <VCol cols="12">
              <h3 class="my-10">
                Density prop is set to comfortable
              </h3>
              <VTimeline
                direction="vertical"
                line-color="success"
                line-thickness="5"
                density="comfortable"
                truncate-line="both"
              >
                <VTimelineItem>
                  <template #opposite>
                    Opposite Content
                  </template>
                  <VCard
                    elevation="7"
                    title="Content Title"
                  >
                    <VCardText> Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum molestias nam,!</VCardText>
                  </VCard>
                </VTimelineItem>

                <VTimelineItem>
                  <template #opposite>
                    Opposite Content
                  </template>
                  <VCard
                    elevation="7"
                    title="Content Title"
                  >
                    <VCardText> Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum molestias nam,!</VCardText>
                  </VCard>
                </VTimelineItem>

                <VTimelineItem>
                  <template #icon>
                    <VAvatar :image="avatar1" />
                  </template>
                  <template #opposite>
                    Opposite Content
                  </template>

                  <VCard
                    elevation="7"
                    title="Content Title"
                  >
                    <VCardText> Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum molestias nam,!</VCardText>
                  </VCard>
                </VTimelineItem>

                <VTimelineItem>
                  <template #opposite>
                    <div class="text-success">
                      Opposite Content
                    </div>
                  </template>
                  <VCard
                    elevation="7"
                    title="Content Title"
                  >
                    <VCardText> Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum molestias nam,!</VCardText>
                  </VCard>
                </VTimelineItem>
              </VTimeline>
            </VCol>

            <VCol
              cols="12"
              class="my-10"
            >
              <h3 class="my-10">
                density prop is set to compact
              </h3>
              <VTimeline
                direction="vertical"
                line-color="success"
                line-thickness="5"
                truncate-line="both"
                density="compact"
              >
                <VTimelineItem>
                  <template #opposite>
                    Opposite Content
                  </template>
                  <VCard
                    elevation="7"
                    title="Content Title"
                  >
                    <VCardText> Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum molestias nam,!</VCardText>
                  </VCard>
                </VTimelineItem>

                <VTimelineItem>
                  <template #opposite>
                    Opposite Content
                  </template>
                  <VCard
                    elevation="7"
                    title="Content Title"
                  >
                    <VCardText> Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum molestias nam,!</VCardText>
                  </VCard>
                </VTimelineItem>

                <VTimelineItem>
                  <template #icon>
                    <VAvatar :image="avatar1" />
                  </template>
                  <template #opposite>
                    Opposite Content
                  </template>

                  <VCard
                    elevation="7"
                    title="Content Title"
                  >
                    <VCardText> Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum molestias nam,!</VCardText>
                  </VCard>
                </VTimelineItem>

                <VTimelineItem>
                  <template #opposite>
                    <div class="text-success">
                      Opposite Content
                    </div>
                  </template>
                  <VCard
                    elevation="7"
                    title="Content Title"
                  >
                    <VCardText> Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum molestias nam,!</VCardText>
                  </VCard>
                </VTimelineItem>
              </VTimeline>
            </VCol>

            <!-- using various props like line-inset dot color size icon icon-color fill-dot -->
            <h3 class="my-16">
              using various props like line-inset dot color size icon icon-color fill-dot
            </h3>
            <VCol cols="12">
              <VTimeline
                direction="horizontal"
                line-color="success"
                truncate-line="both"
                line-thickness="5"
              >
                <VTimelineItem
                  dot-color="error"
                  icon="ri-star-fill"
                  fill-dot
                  icon-color="rgba(0,255,0)"
                >
                  <template #opposite>
                    Opposite Content
                  </template>
                  <VCard
                    elevation="7"
                    title="Content Title"
                  >
                    <VCardText> Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum molestias nam,!</VCardText>
                  </VCard>
                </VTimelineItem>

                <VTimelineItem
                  size="x-small"
                  fill-dot
                >
                  <template #opposite>
                    Opposite Content
                  </template>
                  <VCard
                    elevation="7"
                    title="Content Title"
                  >
                    <VCardText> Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum molestias nam,!</VCardText>
                  </VCard>
                </VTimelineItem>

                <VTimelineItem size="large">
                  <template #icon>
                    <VAvatar :image="avatar1" />
                  </template>
                  <template #opposite>
                    Opposite Content
                  </template>

                  <VCard
                    elevation="7"
                    title="Content Title"
                  >
                    <VCardText> Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum molestias nam,!</VCardText>
                  </VCard>
                </VTimelineItem>

                <VTimelineItem>
                  <template #opposite>
                    <div class="text-success">
                      Opposite Content
                    </div>
                  </template>
                  <VCard
                    elevation="7"
                    title="Content Title"
                  >
                    <VCardText> Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum molestias nam,!</VCardText>
                  </VCard>
                </VTimelineItem>
              </VTimeline>
            </VCol>
          </VRow>
        </VCardText>
      </VCard>
    </VCol>

    <!-- 👉 VColorPicker -->
    <VCol cols="12">
      <VCard title="Color Picker">
        <VCardText>
          <VRow>
            <!-- color picker with swatches -->
            <VCol
              cols="12"
              sm="6"
            >
              <VColorPicker
                elevation="10"
                show-swatches
                swatches-max-height="400px"
              />
            </VCol>

            <!-- color picker with select -->
            <VCol
              cols="12"
              sm="6"
            >
              <p>Used prop like <code>canvas-height, dot-size, Width, elevation</code></p>
              <VColorPicker
                v-model="color"
                v-model:mode="mode"
                elevation="10"
                border
                canvas-height="100"
                dot-size="15"
                rounded
                width="400px"
              />
              <VSelect
                v-model="mode"
                :items="modes"
              />
            </VCol>
          </VRow>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>
