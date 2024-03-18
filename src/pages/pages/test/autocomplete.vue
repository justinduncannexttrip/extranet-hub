<template>
  <!-- 👉 varaints  -->
  <VRow>
    <VCol cols="12">
      <VCard title="Variants">
        <VCardText>
          <VRow>
            <VCol cols="12">
              <VAutocomplete
                label="City"
                :items="['Delhi', 'Mumbai', 'Ahemedabad', 'Bangalore', 'Jaipur']"
                variant="outlined"
              />
            </VCol>
          </VRow>
        </VCardText>
      </VCard>
    </VCol>

    <!-- 👉 autocomplete density -->
    <VCol cols="12">
      <VCard title="density">
        <VCardText>
          <VRow>
            <VCol cols="12">
              <VAutocomplete
                label="City"
                :items="['Delhi', 'Mumbai', 'Ahemedabad', 'Bangalore', 'Jaipur']"
                variant="outlined"
                class="my-5"
                density="default"
              />
              <VAutocomplete
                label="City"
                :items="['Delhi', 'Mumbai', 'Ahemedabad', 'Bangalore', 'Jaipur']"
                variant="outlined"
                class="my-5"
                density="comfortable"
              />
              <VAutocomplete
                label="City"
                :items="['Delhi', 'Mumbai', 'Ahemedabad', 'Bangalore', 'Jaipur']"
                class="my-5"
                variant="outlined"
                density="compact"
              />
            </VCol>
          </VRow>
        </VCardText>
      </VCard>
    </VCol>

    <!-- 👉 autocomplete placeholder  -->
    <VCol cols="12">
      <VCard title="placeholder">
        <VCardText>
          <VRow>
            <VCol cols="12">
              <VAutocomplete
                label="City"
                :items="['Delhi', 'Mumbai', 'Ahemedabad', 'Bangalore', 'Jaipur']"
                placeholder="Enter city"
                variant="outlined"
                class="my-5"
                density="default"
              />
              <VAutocomplete
                label="City"
                :items="['Delhi', 'Mumbai', 'Ahemedabad', 'Bangalore', 'Jaipur']"
                placeholder="Enter city"
                variant="outlined"
                class="my-5"
                density="comfortable"
              />
              <VAutocomplete
                label="City"
                :items="['Delhi', 'Mumbai', 'Ahemedabad', 'Bangalore', 'Jaipur']"
                placeholder="Enter city"
                class="my-5"
                variant="outlined"
                density="compact"
              />
            </VCol>
          </VRow>
        </VCardText>
      </VCard>
    </VCol>

    <!-- 👉 autocomplete Multiple -->
    <VCol cols="12">
      <VCard title="Multiple">
        <VCardText>
          <VRow>
            <VCol cols="12">
              <VAutocomplete
                label="City"
                :items="['Delhi', 'Mumbai', 'Ahemedabad', 'Bangalore', 'Jaipur']"
                variant="outlined"
                class="my-5"
                multiple
                density="default"
              />
              <VAutocomplete
                label="City"
                :items="['Delhi', 'Mumbai', 'Ahemedabad', 'Bangalore', 'Jaipur']"
                variant="outlined"
                class="my-5"
                multiple
                density="comfortable"
              />
              <VAutocomplete
                label="City"
                :items="['Delhi', 'Mumbai', 'Ahemedabad', 'Bangalore', 'Jaipur']"
                class="my-5"
                variant="outlined"
                multiple
                density="compact"
              />
            </VCol>
          </VRow>
        </VCardText>
      </VCard>
    </VCol>

    <!-- 👉 autocomplete with clearable -->
    <VCol cols="12">
      <VCard title="clearable">
        <VCardText>
          <VRow>
            <VCol cols="12">
              <VAutocomplete
                label="City"
                :items="['Delhi', 'Mumbai', 'Ahemedabad', 'Bangalore', 'Jaipur']"
                variant="outlined"
                class="my-5"
                multiple
                clearable
                density="default"
              />
              <VAutocomplete
                label="City"
                :items="['Delhi', 'Mumbai', 'Ahemedabad', 'Bangalore', 'Jaipur']"
                variant="outlined"
                class="my-5"
                multiple
                clearable
                density="comfortable"
              />
              <VAutocomplete
                label="City"
                :items="['Delhi', 'Mumbai', 'Ahemedabad', 'Bangalore', 'Jaipur']"
                class="my-5"
                variant="outlined"
                clearable
                density="compact"
              />
            </VCol>
          </VRow>
        </VCardText>
      </VCard>
    </VCol>

    <!-- 👉 autocomplete with closable chips -->
    <VCol cols="12">
      <VCard title="with closable chips">
        <VCardText>
          <VRow>
            <VCol cols="12">
              <VAutocomplete
                label="City"
                :items="['Delhi', 'Mumbai', 'Ahemedabad', 'Bangalore', 'Jaipur']"
                variant="outlined"
                class="my-5"
                multiple
                chips
                closable-chips
                density="default"
              />
              <VAutocomplete
                label="City"
                :items="['Delhi', 'Mumbai', 'Ahemedabad', 'Bangalore', 'Jaipur']"
                variant="outlined"
                class="my-5"
                multiple
                chips
                closable-chips
                density="comfortable"
              />
              <VAutocomplete
                label="City"
                :items="['Delhi', 'Mumbai', 'Ahemedabad', 'Bangalore', 'Jaipur']"
                class="my-5"
                variant="outlined"
                multiple
                closable-chips
                chips
                density="compact"
              />
            </VCol>
          </VRow>
        </VCardText>
      </VCard>
    </VCol>

    <!-- 👉 Autocomplete closable chips with clearable -->
    <VCol cols="12">
      <VCard title="closable chip with  clearable">
        <VCardText>
          <VRow>
            <VCol cols="12">
              <VAutocomplete
                label="City"
                :items="['Delhi', 'Mumbai', 'Ahemedabad', 'Bangalore', 'Jaipur']"
                variant="outlined"
                class="my-5"
                multiple
                chips
                clearable
                closable-chips
                density="default"
              />
              <VAutocomplete
                label="City"
                :items="['Delhi', 'Mumbai', 'Ahemedabad', 'Bangalore', 'Jaipur']"
                variant="outlined"
                class="my-5"
                multiple
                chips
                clearable
                closable-chips
                density="comfortable"
              />
              <VAutocomplete
                label="City"
                :items="['Delhi', 'Mumbai', 'Ahemedabad', 'Bangalore', 'Jaipur']"
                class="my-5"
                variant="outlined"
                multiple
                clearable
                closable-chips
                chips
                density="compact"
              />
            </VCol>
          </VRow>
        </VCardText>
      </VCard>
    </VCol>

    <!-- 👉 autocomplete with chips -->
    <VCol cols="12">
      <VCard title="with chips">
        <VCardText>
          <VRow>
            <VCol cols="12">
              <VAutocomplete
                label="City"
                :items="['Delhi', 'Mumbai', 'Ahemedabad', 'Bangalore', 'Jaipur']"
                variant="outlined"
                class="my-5"
                multiple
                chips
                density="default"
              />
              <VAutocomplete
                label="City"
                :items="['Delhi', 'Mumbai', 'Ahemedabad', 'Bangalore', 'Jaipur']"
                variant="outlined"
                class="my-5"
                multiple
                chips
                density="comfortable"
              />
              <VAutocomplete
                label="City"
                :items="['Delhi', 'Mumbai', 'Ahemedabad', 'Bangalore', 'Jaipur']"
                class="my-5"
                variant="outlined"
                multiple
                chips
                density="compact"
              />
            </VCol>
          </VRow>
        </VCardText>
      </VCard>
    </VCol>

    <!-- 👉 autocomplete prepend inner icons -->
    <VCol cols="12">
      <VCard title="prepend inner icons">
        <VCardText>
          <VRow>
            <VCol cols="12">
              <VAutocomplete
                label="City"
                :items="['Delhi', 'Mumbai', 'Ahemedabad', 'Bangalore', 'Jaipur']"
                variant="outlined"
                prepend-inner-icon="ri-building-line"
                class="my-5"
                multiple
                density="default"
              />
              <VAutocomplete
                label="City"
                :items="['Delhi', 'Mumbai', 'Ahemedabad', 'Bangalore', 'Jaipur']"
                variant="outlined"
                prepend-inner-icon="ri-building-line"
                class="my-5"
                multiple
                density="comfortable"
              />
              <VAutocomplete
                label="City"
                :items="['Delhi', 'Mumbai', 'Ahemedabad', 'Bangalore', 'Jaipur']"
                class="my-5"
                prepend-inner-icon="ri-building-line"
                variant="outlined"
                multiple
                density="compact"
              />
            </VCol>
          </VRow>
        </VCardText>
      </VCard>
    </VCol>

    <!-- 👉 autocomplete prepend icons -->
    <VCol cols="12">
      <VCard title="prepend icons">
        <VCardText>
          <VRow>
            <VCol cols="12">
              <VAutocomplete
                label="City"
                :items="['Delhi', 'Mumbai', 'Ahemedabad', 'Bangalore', 'Jaipur']"
                variant="outlined"
                prepend-icon="ri-building-line"
                class="my-5"
                multiple
                density="default"
              />
              <VAutocomplete
                label="City"
                :items="['Delhi', 'Mumbai', 'Ahemedabad', 'Bangalore', 'Jaipur']"
                variant="outlined"
                prepend-icon="ri-building-line"
                class="my-5"
                multiple
                density="comfortable"
              />
              <VAutocomplete
                label="City"
                :items="['Delhi', 'Mumbai', 'Ahemedabad', 'Bangalore', 'Jaipur']"
                class="my-5"
                prepend-icon="ri-building-line"
                variant="outlined"
                multiple
                density="compact"
              />
            </VCol>
          </VRow>
        </VCardText>
      </VCard>
    </VCol>

    <!-- 👉 autocomplete append icons -->
    <VCol cols="12">
      <VCard title="append icons">
        <VCardText>
          <VRow>
            <VCol cols="12">
              <VAutocomplete
                label="City"
                :items="['Delhi', 'Mumbai', 'Ahemedabad', 'Bangalore', 'Jaipur']"
                variant="outlined"
                append-icon="ri-building-line"
                class="my-5"
                multiple
                density="default"
              />
              <VAutocomplete
                label="City"
                :items="['Delhi', 'Mumbai', 'Ahemedabad', 'Bangalore', 'Jaipur']"
                variant="outlined"
                append-icon="ri-building-line"
                class="my-5"
                multiple
                density="comfortable"
              />
              <VAutocomplete
                label="City"
                :items="['Delhi', 'Mumbai', 'Ahemedabad', 'Bangalore', 'Jaipur']"
                class="my-5"
                append-icon="ri-building-line"
                variant="outlined"
                multiple
                density="compact"
              />
            </VCol>
          </VRow>
        </VCardText>
      </VCard>
    </VCol>

    <!-- 👉 autocomplete loading  -->
    <VCol cols="12">
      <VCard title="loading">
        <VCardText>
          <VRow>
            <VCol cols="12">
              <VAutocomplete
                label="City"
                :items="['Delhi', 'Mumbai', 'Ahemedabad', 'Bangalore', 'Jaipur']"
                variant="outlined"
                append-icon="ri-building-line"
                class="my-5"
                loading
                multiple
                density="default"
              />
              <VAutocomplete
                label="City"
                :items="['Delhi', 'Mumbai', 'Ahemedabad', 'Bangalore', 'Jaipur']"
                variant="outlined"
                append-icon="ri-building-line"
                class="my-5"
                loading
                multiple
                density="comfortable"
              />
              <VAutocomplete
                label="City"
                :items="['Delhi', 'Mumbai', 'Ahemedabad', 'Bangalore', 'Jaipur']"
                class="my-5"
                append-icon="ri-building-line"
                variant="outlined"
                loading
                multiple
                density="compact"
              />
            </VCol>
          </VRow>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>
