import React from 'react';
import {
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
  ImageBackground,
  Platform,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { Block, Text, theme, Button as GaButton } from 'galio-framework';

import { Button, CharacterDetailComics } from '../components';
import { Images, nowTheme } from '../constants';
import { HeaderHeight } from '../constants/utils';
import { withNavigation } from '@react-navigation/compat';
import { characterdetailcomics } from '../services/characters';

const { width, height } = Dimensions.get('screen');

const thumbMeasure = (width - 48 - 32) / 1.5;

class CharacterDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      loading: true,
      params: null,
    };
  }
  componentDidMount() {
    this.getDetail();
  }

  async getDetail() {
    const { id } = this.props.route.params;
    if (this.scroll) this.scroll.scrollTo({ y: 0 });
    this.setState({ loading: true });
    var data = await characterdetailcomics(id);
    this.setState({ data: data.results, loading: false, id });
  }
  render() {
    const { loading } = this.state;
    const { route } = this.props;
    const { params } = route;
    if (this.state.params != params) {
      this.setState({ params });
      this.getDetail();
    }
    const { image, title, comics, series, stories, events } = params;
    const {
      titleText,
      comicLabel,
      availableText,
      fontFamGeneric,
      aboutText,
      descLabel,
      profileLabel,
      profileContainer,
      CharacterBackground,
      profileCard,
    } = styles;
    return (
      <ScrollView ref={(node) => (this.scroll = node)}>
        <ImageBackground
          source={Images.CharacterBackground}
          style={profileContainer}
          imageStyle={CharacterBackground}
        >
          <Block flex style={profileCard}>
            <Block flex style={{ width: width, zIndex: 5, paddingHorizontal: 20 }}>
              <Block middle style={{ top: height * 0.15 }}>
                <Image source={image} style={styles.avatar} />
              </Block>
              <Block style={{ top: height * 0.2 }}>
                <Block middle>
                  <Text center style={titleText} color="#ffffff">
                    {title}
                  </Text>
                  <Text size={16} color="white" style={comicLabel}>
                    Karakter
                  </Text>
                </Block>
                <Block style={styles.info}>
                  <Block row space="around">
                    <Block middle>
                      <Text size={18} color="white" style={availableText}>
                        {comics.available}
                      </Text>
                      <Text style={fontFamGeneric} size={14} color="white">
                        Çizgi Roman
                      </Text>
                    </Block>

                    <Block middle>
                      <Text color="white" size={18} style={availableText}>
                        {series.available}
                      </Text>
                      <Text style={fontFamGeneric} size={14} color="white">
                        Dizi
                      </Text>
                    </Block>

                    <Block middle>
                      <Text color="white" size={18} style={availableText}>
                        {stories.available}
                      </Text>
                      <Text style={fontFamGeneric} size={14} color="white">
                        Hikaye
                      </Text>
                    </Block>

                    <Block middle>
                      <Text color="white" size={18} style={availableText}>
                        {events.available}
                      </Text>
                      <Text style={fontFamGeneric} size={14} color="white">
                        Olay
                      </Text>
                    </Block>
                  </Block>
                </Block>
              </Block>
            </Block>
            <Block flex middle row style={{ width: width, zIndex: 99, paddingTop:200 }}>
              <Button
                onPress={() => Linking.openURL(params.urls.find((f) => f.type == 'detail').url)}
                style={profileLabel}
                textStyle={{ fontSize: 16 }}
                round
              >
                Marvel Profili
              </Button>
              <GaButton
                round
                onlyIcon
                shadowless
                onPress={() => {
                  this.scroll.scrollTo({ y: height });
                }}
                icon="arrow-down"
                iconFamily="Font-Awesome"
                iconColor={nowTheme.COLORS.WHITE}
                iconSize={nowTheme.SIZES.BASE * 1.375}
                color={'#888888'}
                style={[styles.social, styles.shadow]}
              />
              <GaButton
                round
                onlyIcon
                shadowless
                icon="file"
                onPress={() => Linking.openURL(params.urls.find((f) => f.type == 'comiclink').url)}
                iconFamily="Font-Awesome"
                iconColor={nowTheme.COLORS.WHITE}
                iconSize={nowTheme.SIZES.BASE * 1.375}
                color={'#888888'}
                style={[styles.social, styles.shadow]}
              />
            </Block>
          </Block>
        </ImageBackground>

        {loading ? (
          <Block flex>
            <ActivityIndicator size="large" color={nowTheme.COLORS.ACTIVE} />
          </Block>
        ) : (
          <Block flex style={{ marginTop: 20 }}>
            <Block middle>
              <Text style={aboutText}>Hakkında</Text>
              <Text size={16} muted style={descLabel}>
                {params.description}
              </Text>
            </Block>
            <Block row style={{ paddingVertical: 14, paddingHorizontal: 15 }} space="between">
              <Text bold size={16} color="#2c2c2c" style={{ marginTop: 3 }}>
                Çizgi Romanlar
              </Text>
            </Block>

            <Block style={{ paddingBottom: -HeaderHeight * 2, paddingHorizontal: 15 }}>
              <Block>
                {loading
                  ? null
                  : this.state.data.map((item, i) => (
                      <CharacterDetailComics
                        key={item.id}
                        item={{
                          id: item.id,
                          title: item.title,
                          image: {
                            uri:
                              item.thumbnail.path +
                              '/standard_amazing.' +
                              item.thumbnail.extension,
                          },
                          cta: 'Çizgi Roman Detayları',
                          ...item,
                        }}
                        full
                        ctaRight
                        detailPage="ComicDetail"
                      />
                    ))}
              </Block>
            </Block>
          </Block>
        )}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  profileContainer: {
    width,
    height,
    padding: 0,
    zIndex: 1,
  },
  CharacterBackground: {
    width,
  },

  info: {
    marginTop: 30,
    paddingHorizontal: 10,
  },
  avatarContainer: {
    position: 'relative',
    marginTop: -80,
  },
  avatar: {
    width: thumbMeasure,
    height: thumbMeasure,
    borderRadius: 25,
    borderWidth: 0,
  },
  nameInfo: {
    marginTop: 35,
  },
  thumb: {
    borderRadius: 4,
    marginVertical: 4,
    alignSelf: 'center',
    width: thumbMeasure,
    height: thumbMeasure,
  },
  social: {
    width: nowTheme.SIZES.BASE * 3,
    height: nowTheme.SIZES.BASE * 3,
    borderRadius: nowTheme.SIZES.BASE * 1.5,
    justifyContent: 'center',
    zIndex: 99,
    marginHorizontal: 5,
  },
  titleText: {
    fontFamily: 'montserrat-bold',
    marginBottom: theme.SIZES.BASE / 2,
    fontWeight: '900',
    fontSize: 28,
    textAlign: 'center',
    color: nowTheme.COLORS.ACTIVE,
  },
  comicLabel: {
    marginTop: 5,
    fontFamily: 'montserrat-bold',
    lineHeight: 20,
    fontWeight: 'bold',
    fontSize: 20,
    opacity: 0.8,
  },
  availableText: { marginBottom: 4, fontFamily: 'montserrat-bold' },
  fontFam: { fontFamily: 'montserrat-regular' },
  aboutText: {
    color: '#2c2c2c',
    fontWeight: 'bold',
    fontSize: 19,
    fontFamily: 'montserrat-bold',
    marginTop: 15,
    marginBottom: 30,
    zIndex: 2,
  },
  descLabel: {
    textAlign: 'center',
    fontFamily: 'montserrat-regular',
    zIndex: 2,
    lineHeight: 25,
    color: '#9A9A9A',
    paddingHorizontal: 15,
  },
  profileLabel: {
    width: 114,
    height: 44,
    marginHorizontal: 5,
    elevation: 0,
    backgroundColor: nowTheme.COLORS.ACTIVE,
  },
});

export default withNavigation(CharacterDetail);
