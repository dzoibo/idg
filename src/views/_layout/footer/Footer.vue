<template>
  <footer class="Footer">
    <div class="Footer__ctn container">
      <div class="Footer__blocks">
        <div class="Footer__block Footer__block--left">
          <div class="Footer__contact">
              <h4 class="Footer__title">{{ $t('footer.contact') }}</h4>
              <div class="Footer__contactLogos">
                  <img src="@/assets/images/footer/facebook.svg" alt="facebook" class="Footer__contactImg ml-8">
                  <img src="@/assets/images/footer/linkedin.svg" alt="linkedin" class="Footer__contactImg">
                  <img src="@/assets/images/footer/twitter.svg" alt="twitter" class="Footer__contactImg">
                  <img src="@/assets/images/footer/instagram.svg" alt="instagram" class="Footer__contactImg">
              </div>
          </div>
          <div class="Footer__adressCtn">
              <v-icon icon="mdi-map-marker-outline"></v-icon>
              <div class="Footer__adress">
                  <span class="font-weight-medium">Bureau de la communauté urbaine de Douala</span>
                  <span>Quartier Bonandjo</span>
                  <span>Place de l'hotel de ville</span>
                  <span>Douala</span>
              </div>
          </div>
          <div class="Footer__adressCtn">
              <v-icon icon="mdi-phone-outline"></v-icon>
              <div class="Footer__adress">
                  <span>00 237 6 97 70 97 18</span>
              </div>
          </div>
          <v-btn color="main-yellow" class="Footer__btn" variant="flat" prepend-icon="mdi-email-outline" append-icon="mdi-arrow-right">{{ $t('footer.email') }}</v-btn>
      
        </div>
        <div class="Footer__block Footer__block--right">
          <h4 class="Footer__title">{{ $t('footer.partners') }}</h4>
          <div class="Footer__partnersLogos">
              <img src="@/assets/images/footer/cameroun_flag.svg" alt="cameroun flag">
              <img src="@/assets/images/footer/cameroun_flag.svg" alt="cameroun flag">
          </div>
        </div>
      </div>
      <div class="Footer__links">
        <router-link :to="{ name: 'home' }">{{ $t('footer.legal') }}</router-link>
        <router-link :to="{ name: 'home' }">{{ $t('footer.privacy') }}</router-link>
        <router-link :to="{ name: 'home' }">{{ $t('footer.cgu') }}</router-link>
        <router-link :to="{ name: 'home' }">{{ $t('footer.plan') }}</router-link>
        <router-link :to="{ name: 'home' }">{{ $t('footer.cookies') }}</router-link>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts"></script>

<style lang="scss">
.Footer {
  background-image: url('@/assets/images/Frise.svg');
  background-repeat: repeat-x;
  width: 100%;
  padding: 6rem 0 2rem 0;
  position: relative;

  &::after {
    content: '';
    z-index: -1;
    background: linear-gradient(to top, transparent 0%, rgb(var(--v-theme-light-blue)) 100%);
    position: absolute;
    inset: 0;
    height: 8rem;
  }

  .Footer__ctn {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 2rem;

    .Footer__blocks {
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-between;
      gap: 6rem;

      .Footer__block {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;

        &--left {
          gap: 1.5rem;
          flex: 1 0 auto;
        }

        .Footer__title {
          color: rgb(var(--v-theme-main-blue));
        }

        .Footer__contactLogos {
          display: flex;
          align-items: center;
          flex-flow: row nowrap;
          gap: 1rem;

          .Footer__contactImg {
            --dim-contact-img: 2rem;
            width: var(--dim-contact-img);
            height: var(--dim-contact-img);
            cursor: pointer;
          }
        }

        .Footer__contact {
          display: flex;
          align-items: center;
          width: 100%;
          color: rgb(var(--v-theme-main-blue));
          font-weight: 700;
        }

        .Footer__adressCtn {
          display: flex;
          flex-direction: row;
          padding: 0 1rem;
          gap: 0.5rem;
        }

        .Footer__adress {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .Footer__partner {
          height: 2.5rem;
          display: flex;
          align-items: center;
          color: rgb(var(--v-theme-main-blue));
          font-weight: 700;
        }

        .Footer__partnersLogos {
          display: flex;
          flex-flow: row nowrap;
          gap: 2rem;
          margin-top: 1rem;

          & > img {
            border: solid 1px rgb(var(--v-theme-main-blue));
          }

          img {
            height: 4.5rem;
            cursor: pointer;
          }
        }

        .Footer__btn {
          width: fit-content;
          height: 2.5rem;

          span {
            font-weight: 400;
          }
        }

        .Footer__secondaryPartnersLogos {
          margin-top: 3rem;
          display: flex;
          flex-flow: row wrap;
          align-items: center;
          gap: 1rem;

          img {
            height: 3.5rem;
            cursor: pointer;
          }
        }
      }
    }
  }

  .Footer__links {
    $dim-divider: 0.5rem;
    display: flex;
    flex-flow: row wrap;
    margin-top: 2rem;
    gap: $dim-divider;
    align-items: center;

    a {
      text-decoration: none;
      white-space: nowrap;
    }

    & > *:not(:last-child) {
      &::after {
        content: '|';
        margin-left: $dim-divider;
      }
    }
  }
}

@media (max-width: $bp-lg) {
  .Footer {
    .Footer__ctn {
      .Footer__blocks {
        width: 100%;
        flex-direction: column-reverse;

        .Footer__block {
          &--left {
            width: 100%;
            padding-right: 0px;
          }

          &--right {
            width: 100%;
          }

          .Footer__title {
            text-align: center;
            font-size: $font-size-h3;
          }

          .Footer__contactLogos {
            .Footer__contactImg {
            }
          }

          .Footer__contact {
            margin-top: 1rem;
            flex-direction: column;
            font-size: $font-size-h3;
            gap: 1rem;
          }

          .Footer__partner {
            justify-content: center;
            font-size: $font-size-h3;
          }

          .Footer__partnersLogos {
            gap: 1rem;
            justify-content: center;

            img {
              height: 4rem;
            }
          }

          .Footer__btn {
            width: 100%;
          }

          .Footer__secondaryPartnersLogos {
            margin-top: 1rem;
            height: 4rem;
            flex-wrap: wrap;
            align-items: center;
            justify-content: center;
          }
        }
      }
    }

    .Footer__links {
      justify-content: center;
    }
  }
}
</style>
