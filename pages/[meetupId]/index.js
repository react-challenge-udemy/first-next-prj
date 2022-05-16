import { MongoClient, ObjectId } from 'mongodb';
import MeetupDetail from '../../components/meetups/MeetupDetail';

function MeetupDetails(props) {
  return (
    <Fragment>
      <Head>
        <title>{props.meetupData.title}</title>
        <meta name='description' content={props.meetupData.description} />
      </Head>
      <MeetupDetail
        image={props.meetupData.image}
        title={props.meetupData.title}
        address={props.meetupData.address}
        description={props.meetupData.description}
      />
    </Fragment>
  );
}

export async function getStaticPaths() {

  const client = await MongoClient.connect(
    'mongodb+srv://parisa:parisa7323060@cluster0.n2sct.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
  );
  const db = client.db();

  const meetupsCollection = db.collection('meetups');
  const meetups = meetupsCollection.find({}, { _id: 1 }).toArray();

  client.close();

  return {
    fallback: false,
    paths: meetups.map(meetup => ({ params: { meetupId: meetup._id.toString() } })),

  };
}

export async function getStaticProps(context) {
  // fetch data for a single meetup

  const meetupId = context.params.meetupId;

  const client = await MongoClient.connect(
    'mongodb+srv://parisa:parisa7323060@cluster0.n2sct.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
  );
  const db = client.db();

  const meetupsCollection = db.collection('meetups');

  const selectMeetup = await meetupsCollection.findOne({ _id: ObjectId(meetupId) });

  console.log(meetupId);

  return {
    props: {
      meetupData: {
        id: selectMeetup._id,
        title: selectMeetup.title,
        image: selectMeetup.image,
        description: selectMeetup.description
      },
    },
  };
}

export default MeetupDetails;
