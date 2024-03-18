<template>
  <VRow>
    <!-- SECTION VSelect -->
    <!-- variants -->
    <VCol cols="12">
      <VCard title="varinats">
        <VCardText>
          <VSelect
            label="Select City"
            variant="outlined"
            :items="['Mumbai', 'Delhi', 'Ahmedabad']"
            class="my-3"
          />
        </VCardText>
      </VCard>
    </VCol>

    <!-- 👉 variants with density -->
    <VCol cols="12">
      <VCard title="density">
        <VRow>
          <VCol
            cols="12"
            md="6"
          >
            <VCardText>
              <h2>Outlined</h2>

              <VSelect
                density="default"
                :items="['Mumbai', 'Delhi', 'Ahmedabad']"
                class="my-3"
                placeholder="select city"
              />
              <VSelect
                density="comfortable"
                :items="['Mumbai', 'Delhi', 'Ahmedabad']"
                class="my-3"
                placeholder="select city"
              />
              <VSelect
                density="compact"
                :items="['Mumbai', 'Delhi', 'Ahmedabad']"
                class="my-3"
                placeholder="select city"
              />
            </VCardText>
          </VCol>
        </VRow>
      </VCard>
    </VCol>

    <!-- 👉 multiple -->
    <VCol cols="12">
      <VCard title="multiple">
        <VRow>
          <VCol
            cols="12"
            md="6"
          >
            <VCardText>
              <h2>Outlined</h2>

              <VSelect
                density="default"
                :items="['Mumbai', 'Delhi', 'Ahmedabad']"
                class="my-3"
                placeholder="select city"
                multiple
              />
              <VSelect
                density="comfortable"
                :items="['Mumbai', 'Delhi', 'Ahmedabad']"
                class="my-3"
                placeholder="select city"
                multiple
              />
              <VSelect
                density="compact"
                :items="['Mumbai', 'Delhi', 'Ahmedabad']"
                class="my-3"
                placeholder="select city"
                multiple
              />
            </VCardText>
          </VCol>
        </VRow>
      </VCard>
    </VCol>

    <!-- 👉 clearble -->
    <VCol cols="12">
      <VCard title="clearable">
        <VCardText>
          <p>Persistent-clear prop is also available and applied in last 2 example</p>

          <VSelect
            label="Select City"
            variant="outlined"
            :items="['Mumbai', 'Delhi', 'Ahmedabad']"
            class="my-3"
            clearable
            multiple
            persistent-clear
          />
        </VCardText>
      </VCard>
    </VCol>

    <!-- 👉 chips -->
    <VCol cols="12">
      <VCard title="Chips">
        <VRow>
          <VCol
            cols="12"
            md="6"
          >
            <VCardText>
              <h2>Outlined</h2>

              <VSelect
                density="default"
                :items="['Mumbai', 'Delhi', 'Ahmedabad']"
                class="my-3"
                placeholder="select city"
                multiple
                chips
              />
              <VSelect
                density="comfortable"
                :items="['Mumbai', 'Delhi', 'Ahmedabad']"
                class="my-3"
                placeholder="select city"
                multiple
                chips
              />
              <VSelect
                density="compact"
                :items="['Mumbai', 'Delhi', 'Ahmedabad']"
                class="my-3"
                placeholder="select city"
                multiple
                chips
              />
            </VCardText>
          </VCol>
        </VRow>
      </VCard>
    </VCol>

    <!-- 👉 closable chips -->
    <VCol cols="12">
      <VCard title="Closable Chips">
        <VRow>
          <VCol
            cols="12"
            md="6"
          >
            <VCardText>
              <h2>Outlined</h2>

              <VSelect
                density="default"
                :items="['Mumbai', 'Delhi', 'Ahmedabad']"
                class="my-3"
                placeholder="select city"
                multiple
                closable-chips
                chips
              />
              <VSelect
                density="comfortable"
                :items="['Mumbai', 'Delhi', 'Ahmedabad']"
                class="my-3"
                placeholder="select city"
                multiple
                closable-chips
                chips
              />
              <VSelect
                density="compact"
                :items="['Mumbai', 'Delhi', 'Ahmedabad']"
                class="my-3"
                placeholder="select city"
                multiple
                closable-chips
                chips
              />
            </VCardText>
          </VCol>
        </VRow>
      </VCard>
    </VCol>

    <!-- 👉 closable chips clearable -->
    <VCol cols="12">
      <VCard title="Closable Chips with clearable ">
        <VRow>
          <VCol
            cols="12"
            md="6"
          >
            <VCardText>
              <h2>Outlined</h2>

              <VSelect
                density="default"
                :items="['Mumbai', 'Delhi', 'Ahmedabad']"
                class="my-3"
                placeholder="select city"
                multiple
                closable-chips
                chips
                clearable
              />
              <VSelect
                density="comfortable"
                :items="['Mumbai', 'Delhi', 'Ahmedabad']"
                class="my-3"
                placeholder="select city"
                multiple
                closable-chips
                chips
                clearable
              />
              <VSelect
                density="compact"
                :items="['Mumbai', 'Delhi', 'Ahmedabad']"
                class="my-3"
                placeholder="select city"
                multiple
                closable-chips
                chips
                clearable
              />
            </VCardText>
          </VCol>
        </VRow>
      </VCard>
    </VCol>

    <!-- 👉 Counters -->
    <VCol cols="12">
      <VCard title="counter">
        <VCardText>
          <p class="mb-5">
            Persistent-counter prop also available and applied in last example
          </p>

          <VSelect
            label="Select City"
            variant="outlined"
            :items="['Mumbai', 'Delhi', 'Ahmedabad']"
            class="my-3"
            counter
          />
        </VCardText>
      </VCard>
    </VCol>

    <!-- 👉 Direction -->
    <VCol cols="12">
      <VCard title="Direction">
        <VCardText>
          <VRow>
            <VCol
              cols="12"
              md="6"
            >
              <h3>Direction is horizontal</h3>

              <VSelect
                label="Select City"
                variant="outlined"
                :items="['Mumbai', 'Delhi', 'Ahmedabad']"
                class="my-3"
                direction="horizontal"
              />
            </VCol>

            <VCol
              cols="12"
              md="6"
            >
              <h3>Direction is vertical</h3>

              <VSelect
                label="Select City"
                variant="outlined"
                :items="['Mumbai', 'Delhi', 'Ahmedabad']"
                class="my-3"
                direction="vertical"
              />
            </VCol>
          </VRow>
        </VCardText>
      </VCard>
    </VCol>

    <!-- 👉 disabled -->
    <VCol cols="12">
      <VCard title="Disabled selects">
        <VCardText>
          <VSelect
            label="Select City"
            variant="outlined"
            :items="['Mumbai', 'Delhi', 'Ahmedabad']"
            class="my-3"
            disabled
          />
        </VCardText>
      </VCard>
    </VCol>

    <!-- 👉 hint -->
    <VCol cols="12">
      <VCard title="hint">
        <VCardText>
          <p>Persistent-hint prop also available and used in last example</p>
          <VSelect
            label="Select City"
            variant="outlined"
            :items="['Mumbai', 'Delhi', 'Ahmedabad']"
            class="my-3"
            hint="please select your city"
          />
        </VCardText>
      </VCard>
    </VCol>

    <!-- 👉 loading -->
    <VCol cols="12">
      <VCard title="loading">
        <VCardText>
          <VSelect
            label="Select City"
            variant="outlined"
            :items="['Mumbai', 'Delhi', 'Ahmedabad']"
            class="my-3"
            hint="please select your city"
            loading
            color="error"
          />
        </VCardText>
      </VCard>
    </VCol>

    <!-- 👉 placeholder -->
    <VCol cols="12">
      <VCard title="placeholder">
        <VCardText>
          <p>persistent-placeholder prop is also available and applied in last example</p>
          <VRow>
            <VCol cols="12">
              <VSelect
                variant="outlined"
                :items="['Mumbai', 'Delhi', 'Ahmedabad']"
                class="my-3"
                placeholder="please select your city"
              />
            </VCol>
          </VRow>
        </VCardText>
      </VCard>
    </VCol>

    <!-- 👉 prepend-icon -->
    <VCol cols="12">
      <VCard title="prepend icon">
        <VCardText>
          <VRow>
            <VCol cols="12">
              <VSelect
                variant="outlined"
                :items="['Mumbai', 'Delhi', 'Ahmedabad']"
                class="my-3"
                prepend-icon="ri-user-follow-line"
                label="select city"
              />
            </VCol>
          </VRow>
        </VCardText>
      </VCard>
    </VCol>

    <!-- 👉 prepend-inner-icon  -->
    <VCol cols="12">
      <VCard title="prepend inner icon">
        <VCardText>
          <VRow>
            <VCol cols="12">
              <VSelect
                variant="outlined"
                :items="['Mumbai', 'Delhi', 'Ahmedabad']"
                class="my-3"
                prepend-inner-icon="ri-user-follow-line"
              />
            </VCol>
          </VRow>
        </VCardText>
      </VCard>
    </VCol>

    <!-- 👉 append-icon  -->
    <VCol cols="12">
      <VCard title="append inner icon">
        <VCardText>
          <VRow>
            <VCol cols="12">
              <VSelect
                variant="outlined"
                :items="['Mumbai', 'Delhi', 'Ahmedabad']"
                class="my-3"
                append-icon="ri-user-follow-line"
                label="select city"
              />
            </VCol>
          </VRow>
        </VCardText>
      </VCard>
    </VCol>

    <!-- 👉 append-inner-icon  -->
    <VCol cols="12">
      <VCard title="append inner icon">
        <VCardText>
          <VRow>
            <VCol cols="12">
              <VSelect
                variant="outlined"
                :items="['Mumbai', 'Delhi', 'Ahmedabad']"
                class="my-3"
                append-inner-icon="ri-arrow-down-s-line"
                placeholder="select city"
              />
            </VCol>
          </VRow>
        </VCardText>
      </VCard>
    </VCol>

    <!-- 👉 single line  -->
    <VCol cols="12">
      <VCard title="single line">
        <VCardText>
          <VRow>
            <VCol cols="12">
              <VSelect
                variant="outlined"
                :items="['Mumbai', 'Delhi', 'Ahmedabad']"
                class="my-3"
                single-line
                label="select city"
              />
            </VCol>
          </VRow>
        </VCardText>
      </VCard>
    </VCol>

    <!-- !SECTION -->
  </VRow>
</template>
