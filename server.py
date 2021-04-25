from flask import Flask, render_template,send_file,request
from flask_socketio import SocketIO
from threading import Lock
import json
import subprocess



async_mode = None
app = Flask(__name__,template_folder='web')
app.config['SECRET_KEY'] = 'secret!'
socket_ = SocketIO(app, async_mode=async_mode)
thread = None
thread_lock = Lock()



@app.route('/')
def index():
    return render_template('index.html',async_mode=async_mode)

@app.route('/audio/<string:id>')
def audio(id):
    path_to_file = "s3/audio/{}.wav".format(id)

    return send_file(
         path_to_file, 
         mimetype="audio/wav", 
         as_attachment=True, 
         attachment_filename="{}.wav".format(id))

@app.route('/upload', methods = ['GET', 'POST'])
def upload_file():
   if request.method == 'POST':
      f = request.files['file']
      id = str(request.form['id']).split()[0]
      f.save("s3/audio/"+ id + ".wav")
      t = str(request.form['transcript'])
      with open('s3/text/{}.txt'.format(id),'w+') as file:
          file.write(t)
      process = subprocess.Popen("bash align.sh s3/txt/{0}.txt s3/audio/{0}.wav data/lang_chain/ s3/faligned/{0}.out.ctm  s3/faligned/{0}.out_phone.ctm  s3/faligned/{0}.out_transid_seq.txt  s3/faligned/{0}.lpf.txt s3/faligned/{0}.vtt".format(id), shell=True, stdout=subprocess.PIPE)
      process_return = process.stdout.read()
      print(process_return)
      return json.dumps({'success':True}), 201, {'ContentType':'application/json'}

@app.route('/subtitles/<string:id>')
def subtitles(id):
    path_to_file = "s3/faligned/{}.vtt".format(id)

    return send_file(
         path_to_file, 
         mimetype="text/vtt", 
         as_attachment=True, 
         attachment_filename="{}.vtt".format(id))

if __name__ == '__main__':
    socket_.run(app, debug=True)