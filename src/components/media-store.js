import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import MediaStoreItem from './media-store-item.js';
import EpList from './ep-list.js';
import MetadataConfigDialog from './metadata-config-dialog.js';
import EpItemDialog from './ep-item-dialog.js';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CheckIcon from '@material-ui/icons/CheckCircle';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import CreateIcon from '@material-ui/icons/Create';
import DeleteIcon from '@material-ui/icons/Delete';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import Modal from '@material-ui/core/Modal';
import { getImgOfObj, getImgOfType, isEmptyObj } from '../utils/obj-functions';
import {getIdFromItem} from '../utils/api';
import {iso639Langs} from '../iso639-1-full.js'

const styles = theme => ({
  cardWrap: {
    marginLeft: '10%',
    position: 'relative',
    maxWidth: 685,
    color: 'whitesmoke',
    backgroundColor: '#111',
    flexWrap: 'wrap',
  },
  card: {
    marginTop: '3%',
    marginLeft: '10%',
    position: 'relative',
    maxWidth: 685,
    color: 'whitesmoke',
    backgroundColor: '#111',
    display: 'flex',
    height: 250,
  },
  floatingButton: {
    margin: 0,
    bottom: 'auto',
    left: '5%',
    top: 0,
    right: 'auto',
    zIndex: 100,
    position: 'fixed',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
  },
  epCardContent: {
    paddingTop: 0,
  },
  subheading: {
    color: 'grey',
  },
  description: {
    fontSize: '0.9rem',
    color: 'grey',
  },
  epTitle: {
    paddingTop: 15,
    color: 'lightgrey',
  },
  headline: {
    paddingTop: 15,
    fontWeight: 600,
    color: 'rgba(255, 255, 255, 0.87)',
  },
  moreDetailImg: {
    height: 200,
    width: 350,
  },
  root: {
    maxWidth: 768,
    margin: '0 auto',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: '#111',
  },
  gridList: {
    // Promote the list into its own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: 'translateZ(0)',
  },
  subheader: {
    flex: 1,
    fontWeight: 600,
    fontSize: 22,
    color: 'whitesmoke',
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
  },
  addIcon: {
    width: 48,
    height: 48,
  },
  rightIcon: {
    paddingLeft: 7,
  },
  button: {
    zIndex: 1,
    width: '100%',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
  },
  tileRoot: {
    width: "30.9333%",
    minWidth: 200,
    borderWidth: 0,
    minHeight: 100,
  },
});

const isInTitleList = (ser,list) => {
  let retVal = false;
  if ((list!=null)&&(!isEmptyObj(list))){
    const checkId = getIdFromItem(ser);
    Object.keys(list).forEach(lang => {
      if ((list[lang]!=null)
          &&(list[lang].length>0)
          &&(lang===ser.language)){
        retVal = list[lang].some(x => x === checkId)
      }
    })
  }
  return retVal;
}

const LanguageHeader = (props) => {
  const { classes, lang } = props;
  if (lang==null){
    return <div></div>
  } else {
    return (
      <div>
        <ListSubheader
          className={classes.subheader}
          component="div">
          {iso639Langs[lang].name + " (" +iso639Langs[lang].engName +")"}
        </ListSubheader>
      </div>
    )
  }
}

const SerieGridBar = (props) => {
  const { classes, serie, serInx, featuredTitles, onFeaturedTitlesUpdate } = props;

  const handleUncheck = (e) => {
    e.stopPropagation();
    onFeaturedTitlesUpdate(serie,"delete")
  };

  const handleAdd = (e) => {
    e.stopPropagation();
    onFeaturedTitlesUpdate(serie,"add")
  };

  return (
      <GridListTileBar
        title={serie.title}
        classes={{
          root: classes.titleBar,
          title: classes.title,
        }}
        subtitle={(
          <MediaStoreItem
            serie={serie}
            index={serInx}
          />
        )}
        actionIcon={
          <IconButton
            className={classes.icon}
          >
            {isInTitleList(serie,featuredTitles)
              ? (<CheckIcon
                    onClick={handleUncheck}
                    color="primary"
                  />)
              : (<AddCircleOutlineIcon onClick={handleAdd}/>)}
          </IconButton>
        }
      >
      </GridListTileBar>
  )
}

const GridBarCreateNew = (props) => {
  const { classes, filter } = props;
  let typeStr = "video";
  if (filter==="aud"){
    typeStr = "audio";
  } else if (filter==="epub"){
    typeStr = "Book (EPUB)";
  } else if (filter==="html"){
    typeStr = "Training (html)";
  }
  const titleStr = "New " + typeStr + " title";
  return (
      <GridListTileBar
        title={titleStr}
        classes={{
          root: classes.titleBar,
          title: classes.title,
        }}
        actionIcon={
          <Fab
            color="primary"
            className={classes.addIcon}
          >
            <AddIcon/>
          </Fab>
        }
      >
      </GridListTileBar>
  )
}

class MediaStore extends React.Component {
  state = {
    open: false,
    editOpen: false,
    editEpisodeOpen: false,
    createNew: false,
    curLang: undefined,
    showAllEp: false,
    curSer: undefined
  };

  handleEditClose = (e) => {
    this.setState({editOpen: false, createNew: false})
  };

  handleEpEditClose = (e) => {
    this.setState({editEpisodeOpen: false})
  };

  handleAddTitle = (obj) => {
    if (this.props.onAddTitle!=null) {
      this.props.onAddTitle(obj)
      this.setState({curSer: obj})
    }
  }

  handleShowList = () => {
    this.setState({
      showAllEp: true,
    });
  }

  handleCloseShowAllEp = () => {
    this.setState({
      showAllEp: false,
    });
  }

  handleClose = () => {
    this.setState({
      showAllEp: false,
      editOpen: false,
      createNew: false,
      open: false
    })
  };

  handleSetEditMode = (ev) => {
    this.setState({
      curLang: this.state.curSer.language,
      showAllEp: false,
      editOpen: true,
      createNew: false,
      open: false
    })
  }

  handleEditEpClick = (inx) => {
    this.setState({
      curLang: this.state.curSer.language,
      editEpisodeOpen: true,
      createNew: false,
      curEpInx: inx,
    })
  }

  handleDelete = (e) => {
    this.handleClose()
    this.props.onDeleteTitle(this.state.curSer,"delete")
  }

  handleClick = (e,index,curSer) => {
    this.setState({open: true, curSer})
  }

  handleCreateNew = (ev,filter,lang) => {
    ev.stopPropagation();
    this.setState({
      showAllEp: false,
      editOpen: true,
      createNew: true,
      open: false,
      curLang: lang,
      curSer: undefined
    })
  }

  render = () => {
    const { classes, titles, featuredTitles, languages, filter, usbPath } = this.props;
    const { showAllEp, curSer, curEpInx, curLang } = this.state;
    let curIsSerie = ((curSer!=null)
                      &&(curSer.fileList!=null)
                      &&(curSer.fileList.length>1));
    let useBkgrdColor = 'rgba(15, 4, 76, 0.68)';
    if (filter==="vid"){
      useBkgrdColor = 'rgba(255, 215, 0, 0.78)';
    } else if (filter==="epub"){
      useBkgrdColor = 'rgba(120, 215, 120, 0.78)';
    } else if (filter==="html"){
      useBkgrdColor = 'rgba(81, 184, 233, 0.68)';
    }
    const subheaderRootStyle = {
      paddingTop: 35,
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      height: 'auto',
    };
    return (
      <div className={classes.root}>
        {((languages!=null)&&(languages.length>0)) && languages.map((lang,inx) => {
          let filteredSerList = [];
          if ((titles!=null)&&(titles[lang]!=null)&&(!isEmptyObj(titles[lang]))){
            Object.keys(titles[lang]).forEach((title) => {
              if (((titles[lang][title]!=null)
                    &&(titles[lang][title].mediaType===filter))
                  || (filter==='')){
                filteredSerList.push(titles[lang][title])
              }
            })
          }
          return (
            <GridList
              key={inx}
              cellHeight={200}
              cols={3}
              spacing={3}
              className={classes.gridList }
            >
              <GridListTile
                style={subheaderRootStyle}
                cols={3}
              >
                <LanguageHeader
                  onClick={this.handleCreateNew}
                  filter={filter}
                  lang={lang}
                  classes={classes}
                />
              </GridListTile>
              {filteredSerList.map((ser,serInx) => {
                const imgSrcStr = getImgOfObj(usbPath,ser);
                return (
                  <GridListTile
                    key={serInx}
                    onClick={(e)=>{this.handleClick(e,serInx,ser)}}
                    className={classes.tileRoot}
                  >
                    <img src={imgSrcStr} alt={ser.title} />
                    <SerieGridBar
                      classes={classes}
                      serie={ser}
                      serInx={serInx}
                      featuredTitles={featuredTitles}
                      onFeaturedTitlesUpdate={this.props.onFeaturedTitlesUpdate}
                      onClick={this.props.onClick}/>
                  </GridListTile>
                )})}
                <GridListTile
                  key="createNew"
                  onClick={(ev) => this.handleCreateNew(ev,filter,lang)}
                  className={classes.tileRoot}
                >
                  <img src={getImgOfType(usbPath,filter)} alt="Add Video" />
                  <GridBarCreateNew
                    filter={filter}
                    classes={classes}
                    onClick={(ev) => this.handleCreateNew(ev,filter,lang)}/>
                </GridListTile>
              </GridList>
            )}
        )}
        <Modal
          open={this.state.open}
          style={{backgroundColor: useBkgrdColor}}
          onBackdropClick={this.handleClose}
          onClose={this.handleClose}
        >
          <Card
            className={showAllEp ? classes.cardWrap : classes.card}>
             {(curSer!=null)
             && (<div className={classes.details}>
               <CardContent className={showAllEp ? classes.epContent : classes.content}>
                 <Typography className={classes.headline} type="headline" component="h2">
                   {curSer.title}
                 </Typography>
                 <Typography className={classes.description} type="subheading">
                   {curSer.description}
                 </Typography>
                 <Typography className={classes.epTitle} type="subheading">
                   <MediaStoreItem
                     serie={curSer}
                     onlyEpTitle={true}
                   />
                 </Typography>
               </CardContent>
               <CardActions>
                 {curIsSerie && showAllEp && (<IconButton
                   className={classes.actionButton}
                   onClick={this.handleCloseShowAllEp}><ExpandLessIcon nativeColor="grey"/></IconButton>)}
                 {curIsSerie && !showAllEp && (<IconButton
                   className={classes.actionButton}
                   onClick={this.handleShowList}><ExpandMoreIcon nativeColor="grey"/></IconButton>)}
                 <Fab
                   color="primary"
                   onClick={this.handleSetEditMode}>
                   <CreateIcon />
                 </Fab>
                 <Fab
                   color="secondary"
                   onClick={this.handleDelete}>
                   <DeleteIcon />
                 </Fab>
                 <Fab
                   onClick={this.handleClose}
                   className={classes.floatingButton}
                   color="primary"
                 >
                   <CloseIcon />
                 </Fab>
               </CardActions>
             </div>)}
             {(curSer!=null)&&(!showAllEp)
             && (<CardMedia
                 className={classes.moreDetailImg}
                 image={getImgOfObj(usbPath,curSer)}
                 title={curSer.title}
               />)}
             {curIsSerie && showAllEp
             && (<EpList
               serie={curSer}
               isPaused={false}
               usbPath={usbPath}
               allowEdit={true}
               onEdit={this.handleEditEpClick}
               imgSrc={getImgOfObj(usbPath,curSer)}/>)}
           </Card>
        </Modal>
        <MetadataConfigDialog
          usbPath={this.props.usbPath}
          usbHash={this.props.usbHash}
          open={this.state.editOpen}
          createNew={this.state.createNew}
          item={curSer}
          backgroundColor={useBkgrdColor}
          filter={filter}
          lang={curLang}
          onClose={this.handleEditClose}
          onAddTitle={this.props.onAddTitle}
        />
        <EpItemDialog
          usbPath={this.props.usbPath}
          usbHash={this.props.usbHash}
          open={this.state.editEpisodeOpen}
          createNew={this.state.createNew}
          item={curSer}
          epInx={curEpInx}
          backgroundColor={useBkgrdColor}
          filter={filter}
          lang={curLang}
          onClose={this.handleEpEditClose}
          onAddTitle={this.handleAddTitle}
        />
      </div>
    )
  }
}

MediaStore.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(MediaStore);
