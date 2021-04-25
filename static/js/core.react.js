const {
  Button,
  AppBar,
  colors,
  CssBaseline,
  ThemeProvider,
  Typography,
  Container,
  makeStyles,
  createMuiTheme,
  TextField,
  ButtonGroup,
} = MaterialUI;

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#556cd6",
    },
    secondary: {
      main: "#19857b",
    },
    error: {
      main: colors.red.A400,
    },
    background: {
      default: "#fff",
    },
  },
  spacing: 12,
});

const useStylesUploader = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const useStylesAppBar = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
    padding: 4,
  },
}));

const SubmitForm = (e) => {
  e.preventDefault();
  console.log(e);
  const formData = new FormData(e.target);
  const body = {};
  formData.forEach((value, property) => (body[property] = value));
  axios.post("/upload", formData);
};

const Uploader = () => {
  const classes = useStylesUploader();
  const [fname, setFname] = React.useState("");
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Upload File with Audio
        </Typography>
        <Typography id="fname" fullWidth component="h6" variant="h6">
          {fname}
        </Typography>
        <form
          action="/upload"
          method="post"
          encType="multipart/form-data"
          onSubmit={(e) => SubmitForm(e)}
          className={classes.form}
          noValidate
        >
          <Button
            variant="contained"
            component="label"
            fullWidth
            className={classes.submit}
          >
            Upload File
            <input
              type="file"
              hidden
              name="file"
              accept="audio/wav"
              onChange={(e) => setFname(e.target.files[0].name)}
            />
          </Button>

          <TextField
            id="outlined-multiline-static"
            label="Transcript"
            multiline
            rows={4}
            defaultValue="Enter your transcript here..."
            variant="outlined"
            fullWidth
            className={classes.submit}
            name="transcript"
          />
          <TextField
            id="outlined-static"
            label="Id"
            defaultValue="Enter your unique id here..."
            variant="outlined"
            fullWidth
            className={classes.submit}
            name="id"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Upload
          </Button>
        </form>
      </div>
    </Container>
  );
};

const Player = () => {
  const classes = useStylesUploader();

  const [id, setId] = React.useState("");
  const [error, setError] = React.useState(true);

  React.useEffect(() => {
    new audioSync({
      audioPlayer: "audi", // the id of the audio tag
      subtitlesContainer: "audisub", // the id where subtitles should show
      subtitlesFile: `/subtitles/${id}`, // the path to the vtt file
    });
  }, [id]);

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Play Transcript
        </Typography>
        <TextField
          error={error}
          id="outlined-static-player"
          label="Id"
          defaultValue="Enter your unique id here..."
          variant="outlined"
          fullWidth
          className={classes.submit}
          name="id"
          helperText={error === true ? "ID not found!" : ""}
          onChange={(e) => {
            setId(e.target.value);
            axios
              .get(`/audio/${e.target.value}`)
              .then(() => setError(false))
              .catch(() => setError(true));
          }}
        />
        <ButtonGroup
          variant="contained"
          color="primary"
          aria-label="contained primary button group"
        >
          <Button
            onClick={() => {
              var x = document.getElementById("audi");
              x.play();
            }}
          >
            Play
          </Button>
          <Button
            onClick={() => {
              var x = document.getElementById("audi");
              x.pause();
            }}
          >
            Pause
          </Button>
        </ButtonGroup>
        <audio src={`/audio/${id}`} id="audi"></audio>
        <Typography id="audisub" component="h6" variant="h6"></Typography>
      </div>
    </Container>
  );
};

const App = () => {
  const classes = useStylesAppBar();
  return (
    <div>
      <div className={classes.root}>
        <AppBar position="static">
          <Typography variant="h6" color="inherit" className={classes.title}>
            Forced Alignment
          </Typography>
        </AppBar>
      </div>
      <Uploader />
      <Player />
    </div>
  );
};

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <App />
  </ThemeProvider>,
  document.getElementById("root")
);
